import { IItem } from '../../interfaces/item/iitem.interface';
import { ISystemItem } from '../../interfaces/item/isystem-item.interface';
export declare abstract class BaseItem implements IItem {
    options: {
        resolver?: ((fieldName: string) => string);
    };
    system: ISystemItem;
    elements: any;
    resolver?: ((fieldName: string) => string);
    constructor(options?: {
        resolver?: ((fieldName: string) => string);
    });
}
