import { IItemQueryConfig } from '../interfaces';
import { ContentItem, Link, TypeResolver } from '../models';
import { IHtmlResolverConfig, IRichTextHtmlParser } from '../parser';
import { stronglyTypedResolver } from './strongly-type.resolver';

export class RichTextResolver {

    /**
     * Resolves modular content inside the Rich text field.
     * Rich text resolved needs to be configured either on the model or query level
     */
    resolveHtml(
        html: string,
        data: {
            richTextHtmlParser: IRichTextHtmlParser,
            typeResolvers: TypeResolver[],
            modularItems: ContentItem[],
            links: Link[],
            enableAdvancedLogging: boolean,
            queryConfig: IItemQueryConfig,
            modularContentWrapperTag: string,
            modularContentWrapperClasses: string[]
        }): string {
        // prepare config
        const config: IHtmlResolverConfig = {
            enableAdvancedLogging: data.enableAdvancedLogging,
            queryConfig: data.queryConfig,
            modularContentWrapperTag: data.modularContentWrapperTag,
            modularContentWrapperClasses: data.modularContentWrapperClasses
        };

        const result = data.richTextHtmlParser.resolveRichTextField(
            html, {
                getLinkResult: (itemId: string) => this.getLinkResult({
                    config: config,
                    links: data.links,
                    itemId: itemId,
                    typeResolvers: data.typeResolvers
                }),
                getModularContentHtml: (itemCodename: string) => this.getHtmlOfModularContent({
                    itemCodename: itemCodename,
                    config: config,
                    modularItems: data.modularItems,
                })
            }, {
                enableAdvancedLogging: data.enableAdvancedLogging,
                queryConfig: data.queryConfig,
                modularContentWrapperTag: data.modularContentWrapperTag,
                modularContentWrapperClasses: data.modularContentWrapperClasses
            });

        return result.resolvedHtml;
    }

    private getHtmlOfModularContent(data: {
        itemCodename: string,
        config: IHtmlResolverConfig,
        modularItems: ContentItem[],
    }): string {
        // get modular content item
        const modularContentItem = data.modularItems.find(m => m.system.codename === data.itemCodename);

        // check if modular content really exists
        if (!modularContentItem) {
            throw Error(`Cannot resolve modular content in 'RichTextField' for '${data.itemCodename}' content item`);
        }

        // create new replacement object

        // get html to replace object using Rich text resolver function
        let resolver: (<TItem extends ContentItem>(item: TItem) => string) | undefined = undefined;
        if (data.config.queryConfig.richTextResolver) {
            // use resolved defined by query if available
            resolver = data.config.queryConfig.richTextResolver;
        } else {
            // use default resolver defined in models
            if (modularContentItem.richTextResolver) {
                resolver = modularContentItem.richTextResolver;
            }
        }

        // check resolver
        if (!resolver) {
            if (data.config.enableAdvancedLogging) {
                console.warn(`Cannot resolve modular content of '${modularContentItem.system.type}' type in 'RichTextField' because no rich text resolved was configured`);
                return '';
            }
            return '';
        }
        return resolver(modularContentItem);
    }

    private getLinkResult(data: {
        itemId: string,
        config: IHtmlResolverConfig,
        links: Link[],
        typeResolvers: TypeResolver[]
    }): string {
        // find link with the id of content item
        const link = data.links.find(m => m.itemId === data.itemId);

        if (!link) {
            if (data.config.enableAdvancedLogging) {
                console.warn(`Cannot resolve URL for item '${data.itemId}' because no link with this id was found`);
            }
            return '';
        }

        // try to resolve link using the resolver passed through the query config
        const queryLinkResolver = data.config.queryConfig.linkResolver;

        let url;

        if (queryLinkResolver) {
            // try to resolve url using the query config
            url = queryLinkResolver(link);
        }

        if (!url) {
            // url was not resolved, try to find global resolver for this particular type
            const emptyTypedItem = stronglyTypedResolver.createEmptyTypedObj<ContentItem>(link.type, data.typeResolvers);

            if (!emptyTypedItem) {
                if (data.config.enableAdvancedLogging) {
                    console.warn(`Cannot resolve link for link of '${link.type}' type with id '${link.itemId}' and url slug '${link.urlSlug}'`);
                }
            } else {
                const globalLinkResolver = emptyTypedItem.linkResolver;
                if (globalLinkResolver) {
                    url = globalLinkResolver(link);
                }
            }
        }

        // url still wasn't resolved
        if (!url) {
            if (data.config.enableAdvancedLogging) {
                console.warn(`Url for content type '${link.type}' with id '${link.itemId}' resolved to null/undefined`);
            }
            return '';
        }

        return url;
    }
}

export const richTextResolver = new RichTextResolver();
