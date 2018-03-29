import { AST } from 'parse5/lib';
import * as parse5 from 'parse5/lib';

import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { IItemQueryConfig } from '../interfaces/item/iitem-query.config';
import { ILink } from '../interfaces/item/ilink.interface';
import { TypeResolverService } from '../services/type-resolver.service';
import { htmlParseService } from '../parser';

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

    /**
    * Rich text resolver
    * @constructor
    * @param {string} html - html to resolve
    * @param {IContentItem[]} modularItems - modular items
    * @param {ILink[]} links - links
    * @param {TypeResolverService} typeResolverService - Type resolver service used to access globally defined properties of models
    * @param {boolean} enableAdvancedLogging - Indicates if advanced issues are logged in console
    * @param {IItemQueryConfig} queryConfig - Query configuration
    */
    constructor(
        private html: string,
        private modularItems: IContentItem[],
        private links: ILink[],
        private typeResolverService: TypeResolverService,
        private enableAdvancedLogging: boolean,
        private queryConfig: IItemQueryConfig,
    ) {
    };

    /**
     * Resolves modular content inside the Rich text field.
     * Rich text resolved needs to be configured either on the model or query level
     */
    resolveHtml(): string {
        const result = htmlParseService.resolveRichTextField({
            contentItems: this.modularItems,
            links: this.links
        }, {
                enableAdvancedLogging: this.enableAdvancedLogging,
                queryConfig: this.queryConfig,
                typeResolverService: this.typeResolverService
            });

        return result.resolvedHtml;
    }
}
