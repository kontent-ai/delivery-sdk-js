import { IItem } from '../interfaces/item/iitem.interface';
import { ICloudResponseSingle, ICloudResponseMultiple } from '../interfaces/item/cloud-responses';
import { TypeResolver } from '../models/item/type-resolver.class';
export declare class ItemMapService {
    private typeResolvers;
    private fieldMapService;
    constructor(typeResolvers: TypeResolver[]);
    private mapItem<TItem>(item, modularContent);
    mapSingleItem<TItem extends IItem>(response: ICloudResponseSingle): TItem;
    mapMultipleItems<TItem extends IItem>(response: ICloudResponseMultiple): TItem[];
}
