import { ItemContracts } from '../../data-contracts/item-contracts';
import { IContentItem } from '../../interfaces';
import { ContentItemSystemAttributes } from './content-item-system-attributes';
import { ItemLinkResolver, ItemPropertyResolver, ItemRichTextResolver } from './item-resolvers';

export class ContentItem implements IContentItem {

    /**
     * Indexer
     */
    [key: string]: any;

    /**
     * Content item system elements
     */
    public system!: ContentItemSystemAttributes;

    /**
     * Raw elements of the item
     */
    public elements!: ItemContracts.IContentItemElementsContracts;

    /**
    * Function used to bind fields returned from Kentico Cloud to a model property.
    * Common use is to bind e.g. 'FirstName' field from Kentico Cloud response to 'firstName' field in model
     */
    public propertyResolver?: ItemPropertyResolver;

    /**
     * Function used to resolve links or URL slug fields
     */
    public linkResolver?: ItemLinkResolver;

    /**
    * Function used to resolve linked items in rich text fields to HTML
    */
    public richTextResolver?: ItemRichTextResolver;

    /**
    * Base class representing content item type. All content type models need to extend this class.
    * @constructor
    */
    constructor(data?: {
        /**
         * Function used to bind fields returned from Kentico Cloud to a model property.
         * Common use is to bind e.g. 'FirstName' field from Kentico Cloud response to 'firstName' field in model
         */
        propertyResolver?: ItemPropertyResolver;

        /**
         *  Function used to resolve links or URL slug fields
         */
        linkResolver?: ItemLinkResolver,

        /**
         * Function used to resolve linked items in rich text fields to HTML
         */
        richTextResolver?: ItemRichTextResolver
    }) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
