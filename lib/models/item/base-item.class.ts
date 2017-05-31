import { IItem } from '../../interfaces/item/iitem.interface';
import { IContentItemSystemAttributes } from '../../interfaces/item/icontent-item-system-attributes.interface'

export abstract class BaseItem implements IItem {
    system: IContentItemSystemAttributes;
    elements: any;
    resolver?: ((fieldName: string) => string);

    constructor(public options?: {
        resolver?: ((fieldName: string) => string)
    }) {
        if (options) Object.assign(this, options);
    }
}