import { IContentItem } from '../../interfaces/item/icontent-item.interface';
import { IModularContent } from '../../interfaces/item/imodular-content.interface';
import { IPagination } from '../../interfaces/common/ipagination.interface';


export class DeliveryItemListingResponse<TItem extends IContentItem> {

   /**
   * Response containing multiple item 
   * @constructor
   * @param {TItem[]} items - Collection of content items
   * @param {IPagination} pagination - Pagination object
   */
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

export class DeliveryItemResponse<TItem extends IContentItem> {

   /**
   * Response containing single item
   * @constructor
   * @param {TItem} item - Returned item
   */
    constructor(
        public item: TItem
    ) { }
}

