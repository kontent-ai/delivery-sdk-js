import { IItem } from '../interfaces/iitem.interface';
import { IModularContent } from '../interfaces/imodular-content.interface';
import { IPagination } from '../interfaces/ipagination.interface';

export class ResponseMultiple<TItem extends IItem> {
    constructor(
        public items: TItem[],
        public pagination: IPagination
    ) { }

    public getFirstItem() {
        if (!this.items) {
            return null;
        }

        if (this.items.length < 1) {
            return null;
        }

        return this.items[0];
    }
}

export class ResponseSingle<TItem extends IItem> {
    constructor(
        public item: TItem
    ) { }
}

