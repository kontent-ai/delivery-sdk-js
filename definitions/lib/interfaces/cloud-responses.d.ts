import { IItem } from '../interfaces/iitem.interface';
import { IModularContent } from '../interfaces/imodular-content.interface';
import { IPagination } from '../interfaces/ipagination.interface';
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
