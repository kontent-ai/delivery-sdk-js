import { IItem } from '../interfaces/iitem.interface';
import { IPagination } from '../interfaces/ipagination.interface';
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
