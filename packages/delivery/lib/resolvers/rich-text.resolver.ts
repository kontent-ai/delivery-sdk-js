import { RichTextContentType } from '../enums';
import { Fields } from '../fields';
import {
    IContentItem,
    IItemQueryConfig,
    ILinkResolverContext,
    ILinkResolverResult,
    IRichTextImageResolverResult,
} from '../interfaces';
import { ItemRichTextResolver, Link, RichTextImage } from '../models';
import { IHtmlResolverConfig, IRichTextHtmlParser, ResolverContext } from '../parser';

export class RichTextResolver {

    /**
     * Resolves linked items inside the Rich text field.
     * Rich text resolved needs to be configured either on the model or query level
     */
    resolveHtml(
        contentItemCodename: string,
        html: string,
        fieldName: string,
        data: {
            richTextHtmlParser: IRichTextHtmlParser,
            getLinkedItem: (codename: string) => IContentItem | undefined,
            links: Link[],
            images: RichTextImage[],
            enableAdvancedLogging: boolean,
            queryConfig: IItemQueryConfig,
            linkedItemWrapperTag: string,
            linkedItemWrapperClasses: string[]
        }): string {
        // prepare config
        const config: IHtmlResolverConfig = {
            enableAdvancedLogging: data.enableAdvancedLogging,
            queryConfig: data.queryConfig,
            linkedItemWrapperTag: data.linkedItemWrapperTag,
            linkedItemWrapperClasses: data.linkedItemWrapperClasses
        };

        const result = data.richTextHtmlParser.resolveRichTextField(
            'root',
            contentItemCodename, html, fieldName, {
                getLinkResult: (itemId: string, linkText: string) => this.getLinkResult({
                    config: config,
                    links: data.links,
                    itemId: itemId,
                    getLinkedItem: data.getLinkedItem,
                    linkText: linkText
                }),
                getLinkedItemHtml: (itemCodename: string, itemType: RichTextContentType) => this.getLinkedItemHtml({
                    itemCodename: itemCodename,
                    config: config,
                    getLinkedItem: data.getLinkedItem,
                    itemType: itemType
                }),
                getImageResult: (resolverContext: ResolverContext, itemCodename: string, imageId: string, xFieldName: string) => this.getImageResult(
                    {
                        resolverContext: resolverContext,
                        getLinkedItem: data.getLinkedItem,
                        itemCodename: itemCodename,
                        config: config,
                        imageId: imageId,
                        images: data.images,
                        html: html,
                        fieldName: xFieldName
                    })
            }, {
                enableAdvancedLogging: data.enableAdvancedLogging,
                queryConfig: data.queryConfig,
                linkedItemWrapperTag: data.linkedItemWrapperTag,
                linkedItemWrapperClasses: data.linkedItemWrapperClasses
            });

        return result.resolvedHtml;
    }

    private getImageResult(data: {
        resolverContext: ResolverContext,
        itemCodename: string,
        getLinkedItem: (codename: string) => IContentItem | undefined,
        config: IHtmlResolverConfig,
        imageId: string,
        images: RichTextImage[],
        html: string,
        fieldName: string
    }): IRichTextImageResolverResult {

        // get linked item
        const linkedItem = data.getLinkedItem(data.itemCodename);

        if (!linkedItem) {
            throw Error(`Linked item with codename '${data.itemCodename}' was not found when resolving image with id '${data.imageId}'`);
        }

        // if image is resolved within nested linked item (e.g. rich text element resolves html of linked item which contains images)
        // the fieldName is equal to the 'root' element on which the html is resolved. For this reason we have to go through all
        // elements in linked item and find the image there.
        let image: RichTextImage | undefined;

        if (data.resolverContext === 'nested') {
            image = this.tryGetImageFromLinkedItem(data.imageId, linkedItem);
        } else {
            const richTextElement = linkedItem[data.fieldName] as Fields.RichTextField;

            if (!(richTextElement instanceof Fields.RichTextField)) {
                throw Error(`Linked item with codename '${data.itemCodename}' has invalid element '${data.fieldName}'. This element is required to be of RichText type.`);
            }
            image = richTextElement.images.find(m => m.imageId === data.imageId);
        }


        if (!image) {
            throw Error(`Image with id '${data.imageId}' was not found in images data for linked item '${data.itemCodename}' and element '${data.fieldName}'`);
        }

        // use custom resolver if present
        if (data.config.queryConfig.richTextImageResolver) {
            return data.config.queryConfig.richTextImageResolver(image, data.fieldName);
        }

        // use default resolver
        return {
            url: image.url
        };
    }

    private tryGetImageFromLinkedItem(imageId: string, contentItem: IContentItem): RichTextImage | undefined {
        for (const propName of Object.keys(contentItem)) {
            const prop = contentItem[propName];
            if (prop instanceof Fields.RichTextField) {
                const image = prop.images.find(m => m.imageId === imageId);

                if (image) {
                    return image;
                }
            }
        }
        return undefined;
    }

    private getLinkedItemHtml(data: {
        itemCodename: string,
        config: IHtmlResolverConfig,
        getLinkedItem: (codename: string) => IContentItem | undefined,
        itemType: RichTextContentType
    }): string {

        // get linked item
        const linkedItem = data.getLinkedItem(data.itemCodename);

        // resolving cannot be done if the item is not present in response
        if (!linkedItem) {
            throw Error(`Linked item with codename '${data.itemCodename}' could not be found in response and therefore the HTML of rich text field could not be evaluated. Increasing 'depth' parameter of your query may solve this issue.`);
        }
        // get html to replace object using Rich text resolver function
        let resolver: ItemRichTextResolver | undefined = undefined;
        if (data.config.queryConfig.richTextResolver) {
            // use resolved defined by query if available
            resolver = data.config.queryConfig.richTextResolver;
        } else {
            // use default resolver defined in models
            if (linkedItem.richTextResolver) {
                resolver = linkedItem.richTextResolver;
            }
        }

        // check resolver
        if (!resolver) {
            if (data.config.enableAdvancedLogging) {
                console.warn(`Cannot resolve html of '${linkedItem.system.type}' type in 'RichTextField' because no rich text resolver was configured.  This warning can be turned off by disabling 'enableAdvancedLogging' option.`);
                return '';
            }
            return '';
        }
        return resolver(linkedItem, {
            contentType: data.itemType
        });
    }

    private getLinkResult(data: {
        itemId: string,
        config: IHtmlResolverConfig,
        links: Link[],
        getLinkedItem: (codename: string) => IContentItem | undefined,
        linkText: string
    }): string | ILinkResolverResult {
        // find link with the id of content item
        const existingLink = data.links.find(m => m.linkId === data.itemId);

        if (!existingLink) {
            if (data.config.enableAdvancedLogging) {
                console.warn(`Cannot resolve URL for item '${data.itemId}' because no link with this id was found. This warning can be turned off by disabling 'enableAdvancedLogging' option.`);
            }
            return '';
        }

        // try to resolve link using the resolver passed through the query config
        const queryLinkResolver = data.config.queryConfig.linkResolver;

        let url;

        // prepare link context
        const linkContext: ILinkResolverContext = {
            linkText: data.linkText,
        };

        if (queryLinkResolver) {
            // try to resolve url using the query config
            url = queryLinkResolver(existingLink, linkContext);
        } else {
            // url was not resolved, try using global link resolver for item
            const linkedItem = data.getLinkedItem(existingLink.codename);

            if (linkedItem && linkedItem.linkResolver) {
                // resolve url using link resolver defined on class level
                url = linkedItem.linkResolver(existingLink, linkContext);
            }
        }

        // url still wasn't resolved
        if (!url) {
            if (data.config.enableAdvancedLogging) {
                console.warn(`Url for content type '${existingLink.type}' with id '${existingLink.linkId}' resolved to null/undefined. This warning can be turned off by disabling 'enableAdvancedLogging' option.`);
            }
            return '';
        }

        return url;
    }
}

export const richTextResolver = new RichTextResolver();
