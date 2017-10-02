// parse5 for parsing HTML
import * as parse5 from 'parse5';
import { AST } from 'parse5';

import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { FieldModels } from './field-models';
import { Fields } from './field-types';
import { IItemQueryConfig } from '../interfaces/item/iitem-query.config';
import { ILink } from '../interfaces/item/ilink.interface';
import { TypeResolverService } from '../services/type-resolver.service';

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
    * @param {IContentItem} modularItems - modular items
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
        // resolve modular content nested within the rich text field 
        // find the all 'object' tags
        // example: <object type="application/kenticocloud" data-type="item" data-codename="geralt"></object>
        var documentFragment = parse5.parseFragment(this.html) as AST.DocumentFragment;

        // get child nodes
        var childeNodes = this.getChildNodes(documentFragment);

        // recursively process all child nodes
        this.processChildNodes(childeNodes);

        // serialize document and get HTML
        var resolvedHtml = parse5.serialize(documentFragment);

        return resolvedHtml;
    }

    private getChildNodes(documentFragment: AST.DocumentFragment): AST.Default.Element[] {
        return (documentFragment as AST.Default.DocumentFragment).childNodes as AST.Default.Element[];
    } 

    private processChildNodes(childNodes: AST.Default.Element[]): void {
        childNodes.forEach(node => {
            if (node.attrs) {
                var attributes = node.attrs;

                // process modular content
                this.processModularContent(node, attributes);

                // process link
                this.processLink(node, attributes);
            }

            if (node.childNodes) {
                // recursively process all nodes
                return this.processChildNodes(this.getChildNodes(node));
            }
        });
    }

    private processLink(node: AST.Default.Node, attributes: AST.Default.Attribute[]): void {
        if (node.nodeName !== this.linkTag) {
            // node is not a link
            return;
        }

        // get all links which have item it attribute, ignore all other links (they can be regular links in rich text)
        var contentItemIdAttribute = attributes.find(m => m.name === this.linkContentItemIdAttributeName);
        if (!contentItemIdAttribute) {
            // its either a regular link or the attribute is not defined
            return;
        }

        // get id of content item
        var contentItemId = contentItemIdAttribute.value;

        // find link with the id of content item
        var link = this.links.find(m => m.itemId === contentItemId);

        if (!link) {
            if (this.enableAdvancedLogging) {
                console.warn(`Cannot resolve URL for item '${contentItemId}' because no link with this id was found`);
            }
            return;
        }

        // try to resolve link using the resolver passed through the query config
        var queryLinkResolver = this.queryConfig.linkResolver;

        var url;

        if (queryLinkResolver) {
            // try to resolve url using the query config
            url = queryLinkResolver(link);
        }

        if (!url) {
            // url was not resolved, try to find global resolver for this particular type
            // and apply its url resolver

            var emptyTypeItem = this.typeResolverService.createEmptyTypedObj<IContentItem>(link.type);

            if (!emptyTypeItem) {
                throw Error(`Cannot resolve link for '${link.type}' type because mapping failed (have you registered this type in your config?)`);
            }

            var globalLinkResolver = emptyTypeItem.linkResolver;
            if (globalLinkResolver) {
                url = globalLinkResolver(link);
            }
        }

        // url still wasn't resolved
        if (!url) {
            if (this.enableAdvancedLogging) {
                console.warn(`Url for content type '${link.type}' with id '${link.itemId}' resolved to null/undefiend`);
            }
            return;
        }

        // assign url to 'href' attribute of the link
        var hrefAttribute = attributes.find(m => m.name === 'href');
        if (!hrefAttribute) {
            // href attribute is missing
            if (this.enableAdvancedLogging) {
                console.warn(`Cannot set url '${url}' because 'href' attribute is not present in the <a> tag`)
            }
            return;
        }

        hrefAttribute.value = url;
    }

    private processModularContent(node: AST.Default.Element, attributes: AST.Default.Attribute[]): void {
        var modularContentAttribute = attributes.find(m => m.value === this.modularContentobjectType);
        if (!modularContentAttribute) {
            // node is not of modular content type
            return;
        }

        // get codename of the modular content
        var modularItemCodenameAttribute: AST.Default.Attribute | undefined = attributes.find(m => m.name === this.modularContentCodenameAttributeName);
        if (modularItemCodenameAttribute == null) {
            throw Error(`The '${this.modularContentCodenameAttributeName}' attribute is missing and therefore modular content item cannot be retrieved`);
        }

        var itemCodename = modularItemCodenameAttribute.value;

        // get modular content item
        var modularContentItem = this.modularItems.find(m => m.system.codename === itemCodename);

        // check if modular content really exists
        if (!modularContentItem) {
            throw Error(`Cannot resolve modular content in 'RichTextField' for '${itemCodename}' content item`);
        }

        // replace 'object' tag name
        node.tagName = this.modularContentTagWrapper;

        // get html to replace object using Rich text resolver function
        var resolver: (<TItem extends IContentItem>(item: TItem) => string) | null = null;
        if (this.queryConfig.richTextResolver) {
            // use resolved defined by query if available
            resolver = this.queryConfig.richTextResolver;
        }
        else {
            // use default resolver defined in models
            if (modularContentItem.richTextResolver) {
                resolver = modularContentItem.richTextResolver;
            }
        }

        // check resolver
        if (resolver == null) {
            if (this.enableAdvancedLogging) {
                console.warn(`Cannot resolve modular content of '${modularContentItem.system.type}' type in 'RichTextField' because no rich text resolved was configured`);
            }
        }
        else {
            var replaceHtml = resolver(modularContentItem);

            var serializedHtml = parse5.parseFragment(replaceHtml) as any;

            // add replaced html to node
            node.childNodes = serializedHtml.childNodes;
        }
    }
}
