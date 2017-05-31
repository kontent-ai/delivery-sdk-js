import { IItem } from '../../interfaces/item/iitem.interface';
import { IPagination } from '../../interfaces/common/ipagination.interface';
export declare class ResponseMultiple<TItem extends IItem> {
    items: TItem[];
    pagination: IPagination;
    constructor(items: TItem[], pagination: IPagination);
    getFirstItem(): TItem;
}
export declare class ResponseSingle<TItem extends IItem> {
    item: TItem;
    constructor(item: TItem);
}
