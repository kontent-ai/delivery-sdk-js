import { IContentItem } from '../../interfaces/item/icontent-item.interface';
import { IContentItemSystemAttributes } from '../../interfaces/item/icontent-item-system-attributes.interface'

export abstract class ContentItem implements IContentItem {
    public system: IContentItemSystemAttributes;
    public elements: any;

    public resolver?: (fieldName: string) => string;
    public urlSlugResolver?: (contentItem: IContentItem, value: string) => string;
    public richTextModularResolver?: <T extends IContentItem>(contentItem: T) => string;

    /**
    * Base class representing content item type. All content type models need to extend this class.
    * @constructor
    * @param {(fieldName: string) => string} resolver - Callback used to bind field returned from Kentico Cloud to a model property. Common usage is to bind e.g. 'FirstName' field from Kentico Cloud response to 'firstName' field in model
    * @param {(contentItem: IContentItem, value: string) => string} urlSlugResolver - Callback used to resolve URL slugs
    * @param {<T extends IContentItem>(contentItem: T) => string} richTextResolver - Callback used to resolve modular content in rich text fields to HTML
    */
    constructor(public options?: {
        resolver?: (fieldName: string) => string,
        urlSlugResolver?: (contentItem: IContentItem, urlSlug: string) => string,
        richTextResolver?: <T extends IContentItem>(contentItem: T) => string;
    }) {
        if (options) Object.assign(this, options);
    }
}