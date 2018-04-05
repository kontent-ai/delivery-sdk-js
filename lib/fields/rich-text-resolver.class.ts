import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { IItemQueryConfig } from '../interfaces/item/iitem-query.config';
import { ILink } from '../interfaces/item/ilink.interface';
import { TypeResolver } from '../models/item/type-resolver.class';
import { IHtmlResolverConfig, IRichTextHtmlParser } from '../parser';
import { stronglyTypedResolver } from '../resolvers';

export class RichTextResolver {

    /**
    * Type identifying nested modular content in Rich text fields
    */
    private readonly modularContentobjectType = 'application/kenticocloud';

    /**
     * This tag wil be used instead of 'object'
     */
    private readonly modularContentTagWrapper = 'div';

    /**
     * Attribute used to identify modular item based on its codename
     */
    private readonly modularContentCodenameAttributeName = 'data-codename';

    /**
     * Tag identifying links
     */
    private readonly linkTag = 'a';

    /**
     * Attributes that identifies if of the content item referenced in links
     */
    private readonly linkContentItemIdAttributeName = 'data-item-id';

    public richTextHtmlParser: IRichTextHtmlParser;
    public typeResolvers: TypeResolver[];
    public html: string;
    public modularItems: IContentItem[];
    public links: ILink[];
    public enableAdvancedLogging: boolean;
    public queryConfig: IItemQueryConfig;

    /**
    * Rich text resolver
    * @constructor
    * @param {IRichTextHtmlParser} richTextHtmlParser - Parser used for working with HTML elements
    * @param {TypeResolver[]} typeResolvers - Type reseolvers
    * @param {string} html - html to resolve
    * @param {IContentItem[]} modularItems - modular items
    * @param {ILink[]} links - links
    * @param {boolean} enableAdvancedLogging - Indicates if advanced issues are logged in console
    * @param {IItemQueryConfig} queryConfig - Query configuration
    */
    constructor(
        data: {
            richTextHtmlParser: IRichTextHtmlParser,
            typeResolvers: TypeResolver[],
            html: string,
            modularItems: IContentItem[],
            links: ILink[],
            enableAdvancedLogging: boolean,
            queryConfig: IItemQueryConfig,
        }
    ) {
        Object.assign(this, data);
    }

    /**
     * Resolves modular content inside the Rich text field.
     * Rich text resolved needs to be configured either on the model or query level
     */
    resolveHtml(): string {
        // prepare config
        const config: IHtmlResolverConfig = {
            enableAdvancedLogging: this.enableAdvancedLogging,
            queryConfig: this.queryConfig,
        };

        const result = this.richTextHtmlParser.resolveRichTextField(
            this.html, {
                getLinkUrl: (itemId: string) => this.getLinkUrl(itemId, config),
                getModularContentHtml: (itemCodename: string) => this.getHtmlOfModularContent(itemCodename, config)
            }, {
                enableAdvancedLogging: this.enableAdvancedLogging,
                queryConfig: this.queryConfig,
            });

        return result.resolvedHtml;
    }

    private getHtmlOfModularContent(itemCodename: string, config: IHtmlResolverConfig): string {
        // get modular content item
        const modularContentItem = this.modularItems.find(m => m.system.codename === itemCodename);

        // check if modular content really exists
        if (!modularContentItem) {
            throw Error(`Cannot resolve modular content in 'RichTextField' for '${itemCodename}' content item`);
        }

        // create new replacement object

        // get html to replace object using Rich text resolver function
        let resolver: (<TItem extends IContentItem>(item: TItem) => string) | null = null;
        if (config.queryConfig.richTextResolver) {
            // use resolved defined by query if available
            resolver = config.queryConfig.richTextResolver;
        } else {
            // use default resolver defined in models
            if (modularContentItem.richTextResolver) {
                resolver = modularContentItem.richTextResolver;
            }
        }

        // check resolver
        if (resolver == null) {
            if (config.enableAdvancedLogging) {
                console.warn(`Cannot resolve modular content of '${modularContentItem.system.type}' type in 'RichTextField' because no rich text resolved was configured`);
                return '';
            }
            return '';
        }
        return resolver(modularContentItem);
    }

    private getLinkUrl(itemId: string, config: IHtmlResolverConfig): string {
        // find link with the id of content item
        const link = this.links.find(m => m.itemId === itemId);

        if (!link) {
            if (config.enableAdvancedLogging) {
                console.warn(`Cannot resolve URL for item '${itemId}' because no link with this id was found`);
            }
            return '';
        }

        // try to resolve link using the resolver passed through the query config
        const queryLinkResolver = config.queryConfig.linkResolver;

        let url;

        if (queryLinkResolver) {
            // try to resolve url using the query config
            url = queryLinkResolver(link);
        }

        if (!url) {
            // url was not resolved, try to find global resolver for this particular type
            // and apply its url resolver

            const emptyTypeItem = stronglyTypedResolver.createEmptyTypedObj<IContentItem>(link.type, this.typeResolvers);

            if (!emptyTypeItem) {
                throw Error(`Cannot resolve link for '${link.type}' type because mapping failed (have you registered this type in your config?)`);
            }

            const globalLinkResolver = emptyTypeItem.linkResolver;
            if (globalLinkResolver) {
                url = globalLinkResolver(link);
            }
        }

        // url still wasn't resolved
        if (!url) {
            if (config.enableAdvancedLogging) {
                console.warn(`Url for content type '${link.type}' with id '${link.itemId}' resolved to null/undefiend`);
            }
            return '';
        }

        return url;
    }
}
