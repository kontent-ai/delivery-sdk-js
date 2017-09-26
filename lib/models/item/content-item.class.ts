import { IContentItem } from '../../interfaces/item/icontent-item.interface';
import { IContentItemSystemAttributes } from '../../interfaces/item/icontent-item-system-attributes.interface'
import { ILink } from '../../interfaces/item/ilink.interface';

export abstract class ContentItem implements IContentItem {

    /**
     * Content item system elements
     */
    public system: IContentItemSystemAttributes;

    /**
     * Elements of the item
     */
    public elements: any;

    /**
    * Callback used to bind fields returned from Kentico Cloud to a model property. 
    * Common use is to bind e.g. 'FirstName' field from Kentico Cloud response to 'firstName' field in model
     */
    public propertyResolver?: (fieldName: string) => string;

    /**
     *  Callback used to resolve links or URL slug fields
     */
    public linkResolver?: (link: ILink) => string;

    /**
    * Callback used to resolve modular content in rich text fields to HTML
    */
    public richTextModularResolver?: (contentItem: IContentItem) => string;

    /**
    * Base class representing content item type. All content type models need to extend this class.
    * @constructor
    * @param {(fieldName: string) => string} propertyResolver - Callback used to bind fields returned from Kentico Cloud to a model property. Common usage is to bind e.g. 'FirstName' field from Kentico Cloud response to 'firstName' field in model
    * @param {(link: ILink) => string} linkResolver - Callback used to resolve links or URL slug fields
    * @param {(contentItem: IContentItem) => string} richTextResolver - Callback used to resolve modular content in rich text fields to HTML
    */
    constructor(public options?: {
        /**
         * Callback used to bind fields returned from Kentico Cloud to a model property. 
         * Common use is to bind e.g. 'FirstName' field from Kentico Cloud response to 'firstName' field in model
         */
        propertyResolver?: (fieldName: string) => string,

        /**
         *  Callback used to resolve links or URL slug fields
         */
        linkResolver?: (link: ILink) => string,

        /**
         * Callback used to resolve modular content in rich text fields to HTML
         */
        richTextResolver?: (contentItem: IContentItem) => string;
    }) {
        if (options) Object.assign(this, options);
    }
}