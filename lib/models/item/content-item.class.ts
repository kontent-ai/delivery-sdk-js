import { IContentItem } from '../../interfaces/item/icontent-item.interface';
import { IContentItemSystemAttributes } from '../../interfaces/item/icontent-item-system-attributes.interface'

export abstract class ContentItem implements IContentItem {
    system: IContentItemSystemAttributes;
    elements: any;

    resolver?: ((fieldName: string) => string);
    urlSlugResolver?: ((fieldName: string, value: string)=> string);

    constructor(public options?: {
        resolver?: ((fieldName: string) => string),
        urlSlugResolver?: ((fieldName: string, value: string) => string)
    }) {
        if (options) Object.assign(this, options);
    }
}