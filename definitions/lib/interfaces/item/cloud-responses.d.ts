import { IItem } from '../../interfaces/item/iitem.interface';
import { IModularContent } from '../../interfaces/item/imodular-content.interface';
import { IPagination } from '../../interfaces/common/ipagination.interface';
export declare class ICloudResponseMultiple {
    items: IItem[];
    modular_content: IModularContent[];
    pagination: IPagination;
    constructor(items: IItem[], modular_content: IModularContent[], pagination: IPagination);
}
export declare class ICloudResponseSingle {
    item: IItem;
    modular_content: IModularContent[];
    constructor(item: IItem, modular_content: IModularContent[]);
}
