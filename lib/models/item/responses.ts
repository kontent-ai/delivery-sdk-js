import { IItem } from '../../interfaces/item/iitem.interface';
import { IModularContent } from '../../interfaces/item/imodular-content.interface';
import { IPagination } from '../../interfaces/common/ipagination.interface';

export class DeliveryItemListingResponse <TItem extends IItem> {
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

export class DeliveryItemResponse <TItem extends IItem> {
    constructor(
        public item: TItem
    ) { }
}

