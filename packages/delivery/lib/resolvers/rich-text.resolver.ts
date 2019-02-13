import { RichTextContentType } from '../enums';
import {
    IItemQueryConfig,
    ILinkResolverContext,
    ILinkResolverResult,
    IRichTextImageResolverResult,
    IRichTextResolverContext,
} from '../interfaces';
import { ContentItem, RichTextImage, Link, TypeResolver } from '../models';
import { IHtmlResolverConfig, IRichTextHtmlParser } from '../parser';
import { stronglyTypedResolver } from './strongly-type.resolver';

export class RichTextResolver {

    /**
     * Resolves linked items inside the Rich text field.
     * Rich text resolved needs to be configured either on the model or query level
     */
    resolveHtml(
        html: string,
        fieldName: string,
        data: {
            richTextHtmlParser: IRichTextHtmlParser,
            typeResolvers: TypeResolver[],
            getLinkedItem: (codename: string) => ContentItem | undefined,
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
            html, fieldName, {
                getLinkResult: (itemId: string, linkText: string) => this.getLinkResult({
                    config: config,
                    links: data.links,
                    itemId: itemId,
                    typeResolvers: data.typeResolvers,
                    linkText: linkText
                }),
                getLinkedItemHtml: (itemCodename: string, itemType: RichTextContentType) => this.getLinkedItemHtml({
                    itemCodename: itemCodename,
                    config: config,
                    getLinkedItem: data.getLinkedItem,
                    itemType: itemType
                }),
                getImageResult: (imageId: string) => this.getImageResult(
                    {
                        config: config,
                        imageId: imageId,
                        images: data.images,
                        html: html,
                        fieldName: fieldName
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
        config: IHtmlResolverConfig,
        imageId: string,
        images: RichTextImage[],
        html: string,
        fieldName: string
    }): IRichTextImageResolverResult {
        // find image
        const image = data.images.find(m => m.imageId === data.imageId);

        if (!image) {
            throw Error(`Image with id '${data.imageId}' was not found in images data`);
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

    private getLinkedItemHtml(data: {
        itemCodename: string,
        config: IHtmlResolverConfig,
        getLinkedItem: (codename: string) => ContentItem | undefined,
        itemType: RichTextContentType
    }): string {

        // get linked item
        const linkedItem = data.getLinkedItem(data.itemCodename);

        // resolving cannot be done if the item is not present in response
        if (!linkedItem) {
            throw Error(`Linked item with codename '${data.itemCodename}' could not be found in response and therefore the HTML of rich text field could not be evaluated. Increasing 'depth' parameter of your query may solve this issue.`);
        }

        // get html to replace object using Rich text resolver function
        let resolver: (<TItem extends ContentItem>(item: TItem, context: IRichTextResolverContext) => string) | undefined = undefined;
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
                console.warn(`Cannot resolve html of '${linkedItem.system.type}' type in 'RichTextField' because no rich text resolved was configured.  This warning can be turned off by disabling 'enableAdvancedLogging' option.`);
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
        typeResolvers: TypeResolver[],
        linkText: string
    }): string | ILinkResolverResult {
        // find link with the id of content item
        const link = data.links.find(m => m.linkId === data.itemId);

        if (!link) {
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
            url = queryLinkResolver(link, linkContext);
        }

        if (!url) {
            // url was not resolved, try to find global resolver for this particular type
            const emptyTypedItem = stronglyTypedResolver.createEmptyTypedObj<ContentItem>(link.type, data.typeResolvers);

            if (!emptyTypedItem) {
                if (data.config.enableAdvancedLogging) {
                    console.warn(`Cannot resolve link for link of '${link.type}' type with id '${link.linkId}' and url slug '${link.urlSlug}'. This warning can be turned off by disabling 'enableAdvancedLogging' option.`);
                }
            } else {
                const globalLinkResolver = emptyTypedItem.linkResolver;
                if (globalLinkResolver) {
                    url = globalLinkResolver(link, linkContext);
                }
            }
        }

        // url still wasn't resolved
        if (!url) {
            if (data.config.enableAdvancedLogging) {
                console.warn(`Url for content type '${link.type}' with id '${link.linkId}' resolved to null/undefined. This warning can be turned off by disabling 'enableAdvancedLogging' option.`);
            }
            return '';
        }

        return url;
    }
}

export const richTextResolver = new RichTextResolver();
