import { IItem } from '../../interfaces/item/iitem.interface';
import { ISystem } from '../../interfaces/item/isystem.interface';

export abstract class BaseItem implements IItem {
    system: ISystem;
    elements: any;
    resolver?: ((fieldName: string) => string);

    constructor(public options?: {
        resolver?: ((fieldName: string) => string)
    }) {
        if (options) Object.assign(this, options);
    }

}