// parse5 for parsing HTML
import * as parse5 from 'parse5';

import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { FieldModels } from './field-models';
import { Fields } from './field-types';
import { IItemQueryConfig } from '../interfaces/item/iitem-query.config';
import { FieldUtilities } from './field-utilities';

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
     * Field utilities
     */
    private fieldUtilities: FieldUtilities;

    /**
    * Rich text resolver
    * @constructor
    * @param {string} html - html to resolve
    * @param {IContentItem} modularItems - modular items
    * @param {boolean} enableAdvancedLogging - Indicates if advanced issues are logged in console
    * @param {IItemQueryConfig} queryConfig - Query configuration
    */
    constructor(
        private html: string,
        private modularItems: IContentItem[],
        private enableAdvancedLogging: boolean,
        private queryConfig: IItemQueryConfig,
    ) {
        this.fieldUtilities = new FieldUtilities();
    };

    /**
     * Resolves modular content inside the Rich text field. 
     * Rich text resolved needs to be configured either on the model or query level
     */
    resolveHtml(): string {
        // resolve modular content nested within the rich text field 
        // find the all 'object' tags
        // example: <object type="application/kenticocloud" data-type="item" data-codename="geralt"></object>
        var documentFragment = parse5.parseFragment(this.html) as any;

        // recursively process all child nodes
        this.processChildNodes(documentFragment.childNodes as FieldModels.Parse5Node[]);

        // serliaze document go get string as HTML
        var resolvedHtml = parse5.serialize(documentFragment);

        return resolvedHtml;
    }

    private processChildNodes(childNodes: FieldModels.Parse5Node[]): void {
        if (childNodes) {
            if (!Array.isArray(childNodes)) {
                throw Error(`Cannot process modular content in 'RichTextField' because child nodes is not an array`);
            }

            childNodes.forEach(node => {
                if (node.attrs) {
                    var attributes = node.attrs as FieldModels.Parse5Attribute[]; // array of attributes => name/value pair

                    // process modular content
                    this.processModularContent(node, attributes);

                    // process link
                    this.processLink(node, attributes);
                }

                if (node.childNodes) {
                    // recursively process all nodes
                    return this.processChildNodes(node.childNodes);
                }
            });
        }
    }

    private processLink(node: FieldModels.Parse5Node, attributes: FieldModels.Parse5Attribute[]): void {
        if (node.nodeName !== this.linkTag) {
            // node is not a link
            return;
        }

        // get all links which have item it attribute, ignore all other links (they can be normal links in rich text)
        var contentItemIdAttribute = attributes.find(m => m.name === this.linkContentItemIdAttributeName);
        if (!contentItemIdAttribute) {
            // its a regular link, don't process it
            return;
        }

        // get id of content item
        var contentItemId = contentItemIdAttribute.value;

        // get content item from modular content
        var contentItem = this.modularItems.find(m => m.system.id === contentItemId);

        if (!contentItem) {
            if (this.enableAdvancedLogging) {
                console.log(`Could not resolve link for item with id '${contentItemId}' because no such item was found in modular items`)
            }
            return;
        }

        // get url slug property 
        var urlSlugField = this.fieldUtilities.getUrlSlugProperty(contentItem);
        if (!urlSlugField) {
            // if url slug field is not defined on content type, don't process it
            return;
        }

        var url = urlSlugField.url;

        if (!url) {
            if (this.enableAdvancedLogging) {
                console.log(`Url for content type '${contentItem.system.type}' with id '${contentItem.system.id}' resolved to null`);
            }
            return;
        }

        // assign url to 'href' attribute of the link
        var hrefAttribute = attributes.find(m => m.name === 'href');
        if (!hrefAttribute) {
            // href attribute is missing
            if (this.enableAdvancedLogging) {
                console.log(`Cannot set url '${url}' because 'href' attribute is not present in the <a> tag`)
            }
            return;
        }

        hrefAttribute.value = url;
    }

    private processModularContent(node: FieldModels.Parse5Node, attributes: FieldModels.Parse5Attribute[]): void {
        var modularContentAttribute = attributes.find(m => m.value === this.modularContentobjectType);
        if (!modularContentAttribute) {
            // node is not of modular content type
            return;
        }

        // get codename of the modular content
        var modularItemCodenameAttribute: FieldModels.Parse5Attribute | undefined = attributes.find(m => m.name === this.modularContentCodenameAttributeName);
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
                console.log(`Cannot resolve modular content of '${modularContentItem.system.type}' type in 'RichTextField' because no rich text resolved was configured`);
            }
        }
        else {
            var replaceHtml = resolver(modularContentItem);

            var serializedHtml = parse5.parseFragment(replaceHtml) as any;

            // add replaced html to node
            node.childNodes = serializedHtml.childNodes as FieldModels.Parse5Node[];
        }
    }
}
