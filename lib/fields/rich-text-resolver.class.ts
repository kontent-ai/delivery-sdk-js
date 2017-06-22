// parse5 for parsing HTML
import * as parse5 from 'parse5';

import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { FieldModels } from './field-models';

export class RichTextResolver {

    /**
    * Type identifying nested modular content in Rich text fields
    */
    private readonly objectType = 'application/kenticocloud';

    /**
     * This tag wil be used instead of 'object'
     */
    private readonly modularContentTagWrapper = 'div';

    /**
     * Attribute used to identify modular item based on its codename
     */
    private readonly codenameAttributeName = 'data-codename';


    /**
    * Rich text resolver
    * @constructor
    * @param {string} html - html to resolve
    * @param {IContentItem} modularItems - modular items
    * @param {boolean} enableAdvancedLogging - Indicates if advanced issues are logged in console
    * @param {<IContentItem>(item: IContentItem) => string} richTextResolverDefinedByQuery - If set, this resolved will be used to resolve modular content instead of the ones defined in model classes
    */
    constructor(
        private html: string,
        private modularItems: IContentItem[],
        private enableAdvancedLogging: boolean,
        private richTextResolverDefinedByQuery?: <IContentItem>(item: IContentItem) => string
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
                if (!node.attrs) {
                    // recursively process all nodes
                    if (node.childNodes) {
                        return this.processChildNodes(node.childNodes);
                    }
                    return this.processChildNodes(null);
                }

                var attributes = node.attrs as FieldModels.Parse5Attribute[]; // array of attributes => name/value pair
                var modularContentAttribute = attributes.find(m => m.value === this.objectType && m.name === 'type');
                if (!modularContentAttribute) {
                    return null;
                }

                // get codename of the modular content
                var modularItemCodenameAttribute = attributes.find(m => m.name === this.codenameAttributeName);
                if (!modularItemCodenameAttribute) {
                    throw Error(`The '${this.codenameAttributeName}' attribute is missing and therefore modular content item cannot be retrieved`);
                }

                // get modular content item
                var modularContentItem = this.modularItems.find(m => m.system.codename === modularItemCodenameAttribute.value);

                // check if modular content really exists
                if (!modularContentItem) {
                    throw Error(`Cannot resolve modular content in 'RichTextField' for '${modularItemCodenameAttribute.value}' content item`);
                }

                // replace 'object' tag name
                node.tagName = this.modularContentTagWrapper;

                // get html to replace object using Rich text resolver function

                var resolver: <IContentItem>(item: IContentItem) => string;
                if (this.richTextResolverDefinedByQuery) {
                    // use resolved defined by query if available
                    resolver = this.richTextResolverDefinedByQuery;
                }
                else {
                    // use default resolver defined in models
                    if (modularContentItem.richTextResolver) {
                        resolver = modularContentItem.richTextResolver;
                    }
                }

                // check resolver
                if (!resolver) {
                    if (this.enableAdvancedLogging) {
                        console.log(`Cannot resolve modular content of '${modularContentItem.system.type}' type in 'RichTextField' because no rich text resolved was configured`);
                    }
                }

                var replaceHtml = resolver(modularContentItem);

                var serializedHtml = parse5.parseFragment(replaceHtml) as any;

                // add replaced html to node
                node.childNodes = serializedHtml.childNodes as FieldModels.Parse5Node[];
            });
        }
    }
}
