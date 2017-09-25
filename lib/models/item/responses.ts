import { IContentItem } from '../../interfaces/item/icontent-item.interface';
import { IModularContent } from '../../interfaces/item/imodular-content.interface';
import { IPagination } from '../../interfaces/common/ipagination.interface';
import { ICloudResponse } from '../../interfaces/common/icloud-response.interface';
import { ICloudResponseDebug } from '../../interfaces/common/icloud-response-debug.interface';

export namespace ItemResponses {
    
    export class DeliveryItemListingResponse<TItem extends IContentItem> implements ICloudResponse {

        /**
         * Indicates if response contains any items
         */
        public isEmpty: boolean;

        /**
        * First item or undefined if none is found
        */
        public firstItem: TItem;

        /**
        * Last item or undefined if response contains no items
        */
        public lastItem: TItem;

        /**
        * Response containing multiple item 
        * @constructor
        * @param {TItem[]} items - Collection of content items
        * @param {IPagination} pagination - Pagination object
        * @param {ICloudResponseDebug} debug - Debug information from the request
        */
        constructor(
            public items: TItem[],
            public pagination: IPagination,
            public debug: ICloudResponseDebug 
        ) {
            this.initIsEmpty();
            this.initFirstAndLastItem();
        }

        private initIsEmpty(): void {
            if (!this.items) {
                this.isEmpty = true;
            }
            else {
                this.isEmpty = this.items.length <= 0;
            }
        }

        private initFirstAndLastItem(): void {
            if (!this.items) {
                return
            }

            if (this.items.length < 1) {
                return;
            }

            this.firstItem = this.items[0];
            this.lastItem = this.items[this.items.length - 1];
        }
    }

    export class DeliveryItemResponse<TItem extends IContentItem> implements ICloudResponse {

        /**
         * Indicates if response contains item
         */
        public isEmpty: boolean;

        /**
        * Response containing single item
        * @constructor
        * @param {TItem} item - Returned item
        * @param {ICloudResponseDebug} debug - Debug information from the request
        */
        constructor(
            public item: TItem,
            public debug: ICloudResponseDebug 
        ) {
            this.initIsEmpty();
        }

        private initIsEmpty(): void {
            if (!this.item) {
                this.isEmpty = true;
            }
            else {
                this.isEmpty = false;
            }
        }
    }
}

