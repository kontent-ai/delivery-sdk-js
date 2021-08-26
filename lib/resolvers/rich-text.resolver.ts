import { ElementModels, Elements } from '../elements';
import {
    IContentItem,
    IItemQueryConfig,
    IRichTextImageResolverResult,
    ItemRichTextResolver,
    ItemUrlSlugResolver,
    IUrlSlugResolverContext,
    IUrlSlugResolverResult,
    Link,
    RichTextImage,
    RichTextItemDataType
} from '../models';
import { IHtmlResolverConfig, IRichTextHtmlParser } from '../parser';

export class RichTextResolver {
    /**
     * Resolves linked items inside the Rich text element.
     * Rich text resolved needs to be configured either on the model or query level
     */
    resolveData(
        contentItemCodename: string,
        html: string,
        elementName: string,
        data: {
            richTextHtmlParser: IRichTextHtmlParser;
            getLinkedItem: (codename: string) => IContentItem | undefined;
            getGlobalUrlSlugResolver: (type: string) => ItemUrlSlugResolver | undefined;
            links: Link[];
            images: RichTextImage[];
            queryConfig: IItemQueryConfig;
            linkedItemWrapperTag: string;
            linkedItemWrapperClasses: string[];
        }
    ): ElementModels.IRichTextResolverData {
        // prepare config
        const config: IHtmlResolverConfig = {
            queryConfig: data.queryConfig,
            linkedItemWrapperTag: data.linkedItemWrapperTag,
            linkedItemWrapperClasses: data.linkedItemWrapperClasses
        };

        const result = data.richTextHtmlParser.resolveRichTextElement(
            contentItemCodename,
            html,
            elementName,
            {
                getUrlSlugResult: (itemId: string, linkText: string) =>
                    this.getUrlSlugResult({
                        config: config,
                        links: data.links,
                        itemId: itemId,
                        getLinkedItem: data.getLinkedItem,
                        linkText: linkText,
                        getGlobalUrlSlugResolver: data.getGlobalUrlSlugResolver
                    }),
                getLinkedItemHtml: (itemCodename: string, itemType: RichTextItemDataType) =>
                    this.getLinkedItemHtml({
                        itemCodename: itemCodename,
                        config: config,
                        getLinkedItem: data.getLinkedItem,
                        itemType: itemType
                    }),
                getImageResult: (itemCodename: string, imageId: string, xElementName: string) =>
                    this.getImageResult({
                        getLinkedItem: data.getLinkedItem,
                        itemCodename: itemCodename,
                        config: config,
                        imageId: imageId,
                        images: data.images,
                        html: html,
                        elementName: xElementName
                    })
            },
            {
                queryConfig: data.queryConfig,
                linkedItemWrapperTag: data.linkedItemWrapperTag,
                linkedItemWrapperClasses: data.linkedItemWrapperClasses
            }
        );

        return {
            html: result.resolvedHtml,
            componentCodenames: result.linkedItems.filter((m) => m.itemType === 'component').map((m) => m.dataCodename),
            linkedItemCodenames: result.linkedItems
                .filter((m) => m.itemType === 'linkedItem')
                .map((m) => m.dataCodename)
        };
    }

    private getImageResult(data: {
        itemCodename: string;
        getLinkedItem: (codename: string) => IContentItem | undefined;
        config: IHtmlResolverConfig;
        imageId: string;
        images: RichTextImage[];
        html: string;
        elementName: string;
    }): IRichTextImageResolverResult {
        // get linked item
        const linkedItem = data.getLinkedItem(data.itemCodename);

        if (!linkedItem) {
            if (data.config.queryConfig.throwErrorForMissingLinkedItems) {
                throw Error(
                    `Linked item with codename '${data.itemCodename}' was not found when resolving image with id '${data.imageId}'`
                );
            }
            console.warn(
                `Cannot resolve image with id '${data.imageId}' because linked item with codename '${data.itemCodename}' is not available. Empty image URL is returned.`
            );
            return {
                url: ''
            };
        }

        // if image is resolved within nested linked item (e.g. rich text element resolves html of linked item which contains images)
        // the element name is equal to the 'root' element on which the html is resolved. For this reason we have to go through all
        // elements in linked item and find the image there.
        let image: RichTextImage | undefined;

        // try getting image from direct element richtext
        const richTextElement = linkedItem[data.elementName] as Elements.RichTextElement | undefined;
        if (richTextElement) {
            if (!(richTextElement instanceof Elements.RichTextElement)) {
                throw Error(
                    `Linked item with codename '${data.itemCodename}' has invalid element '${data.elementName}'. This element is required to be of RichText type.`
                );
            }
            image = richTextElement.images.find((m) => m.imageId === data.imageId);
        }

        // image may be nested, go through all available content items & elements
        if (!image) {
            image = this.tryGetImageFromLinkedItem(data.imageId, linkedItem, data.getLinkedItem);
        }

        if (!image) {
            throw Error(
                `Image with id '${data.imageId}' was not found in images data for linked item '${data.itemCodename}' and element '${data.elementName}'`
            );
        }

        // use custom resolver if present
        if (data.config.queryConfig.richTextImageResolver) {
            return data.config.queryConfig.richTextImageResolver(image, data.elementName);
        }

        // use default resolver
        return {
            url: image.url
        };
    }

    private tryGetImageFromLinkedItem(
        imageId: string,
        contentItem: IContentItem,
        getLinkedItem: (codename: string) => IContentItem | undefined
    ): RichTextImage | undefined {
        for (const propName of Object.keys(contentItem)) {
            const richTextElementProperty = contentItem[propName];
            if (richTextElementProperty instanceof Elements.RichTextElement) {
                const image = richTextElementProperty.images.find((m) => m.imageId === imageId);

                if (image) {
                    return image;
                }

                // try getting images recursively from referenced linked items
                for (const linkedItemCodename of richTextElementProperty.linkedItemCodenames) {
                    const linkedItem = getLinkedItem(linkedItemCodename);

                    if (linkedItem) {
                        const linkedImage = this.tryGetImageFromLinkedItem(imageId, linkedItem, getLinkedItem);

                        if (linkedImage) {
                            return linkedImage;
                        }
                    }
                }
            }
        }

        return undefined;
    }

    private getLinkedItemHtml(data: {
        itemCodename: string;
        config: IHtmlResolverConfig;
        getLinkedItem: (codename: string) => IContentItem | undefined;
        itemType: RichTextItemDataType;
    }): string {
        // get linked item
        const linkedItem = data.getLinkedItem(data.itemCodename);

        // resolving cannot be done if the item is not present in response
        if (!linkedItem) {
            if (data.config.queryConfig.throwErrorForMissingLinkedItems) {
                throw Error(
                    `Linked item with codename '${data.itemCodename}' could not be found in response and therefore the HTML of rich text element could not be evaluated. Increasing 'depth' parameter of your query may solve this issue.`
                );
            }
            console.warn(
                `Cannot resolve linked item '${data.itemCodename}' because it is not available in response. Increasing 'depth' parameter of query may help. Item is resolved to empty string.`
            );
            return '';
        }
        // get html to replace object using Rich text resolver function
        let resolver: ItemRichTextResolver<IContentItem> | undefined = undefined;
        if (data.config.queryConfig.richTextResolver) {
            // use resolved defined by query if available
            resolver = data.config.queryConfig.richTextResolver;
        } else {
            // use default resolver defined in models
            if (linkedItem._config && linkedItem._config.richTextResolver) {
                resolver = linkedItem._config.richTextResolver;
            }
        }

        // check resolver
        if (!resolver) {
            console.warn(
                `Cannot resolve html of '${linkedItem.system.type}' used by item '${data.itemCodename}' type in 'RichTextElement' because no rich text resolver was configured. Item is resolved to empty string.`
            );
            return '';
        }
        return resolver(linkedItem, {
            contentType: data.itemType
        });
    }

    private getUrlSlugResult(data: {
        itemId: string;
        config: IHtmlResolverConfig;
        links: Link[];
        getLinkedItem: (codename: string) => IContentItem | undefined;
        getGlobalUrlSlugResolver: (type: string) => ItemUrlSlugResolver | undefined;
        linkText: string;
    }): IUrlSlugResolverResult {
        // find link with the id of content item
        const existingLink = data.links.find((m) => m.linkId === data.itemId);

        if (!existingLink) {
            console.warn(`Cannot resolve URL for item '${data.itemId}' because no link with this id was found.`);
            return {
                html: '',
                url: ''
            };
        }

        const linkedItem = data.getLinkedItem(existingLink.codename);

        // prepare link context
        const linkContext: IUrlSlugResolverContext = {
            linkText: data.linkText,
            item: linkedItem,
            linkId: data.itemId
        };

        // try to resolve link using the resolver passed through the query config
        const queryUrlSlugResolver = data.config.queryConfig.urlSlugResolver;

        if (queryUrlSlugResolver) {
            // resolve url using query config
            const queryUrlSlugResult = queryUrlSlugResolver(existingLink, linkContext);
            if (queryUrlSlugResult) {
                return queryUrlSlugResult;
            }
        }

        // url was not resolved, try using global link resolver for item
        const globalUrlSlugResolver = data.getGlobalUrlSlugResolver(existingLink.type);
        if (globalUrlSlugResolver) {
            const globalUrlSlugResolverResult = globalUrlSlugResolver(existingLink, linkContext);
            if (globalUrlSlugResolverResult) {
                return globalUrlSlugResolverResult;
            }
        }

        // url wasn't resolved
        console.warn(
            `Url for item of '${existingLink.type}' type with id '${existingLink.linkId}' wasn't resolved. This might be caused by missing 'urlSlugResolver' for given type.`
        );

        return {
            html: '',
            url: ''
        };
    }
}

export const richTextResolver = new RichTextResolver();
