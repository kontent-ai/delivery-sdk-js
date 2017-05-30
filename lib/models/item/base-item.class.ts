import { IItem } from '../../interfaces/item/iitem.interface';
import { ISystemItem } from '../../interfaces/item/isystem-item.interface'

export abstract class BaseItem implements IItem {
    system: ISystemItem;
    elements: any;
    resolver?: ((fieldName: string) => string);

    constructor(public options?: {
        resolver?: ((fieldName: string) => string)
    }) {
        if (options) Object.assign(this, options);
    }
}