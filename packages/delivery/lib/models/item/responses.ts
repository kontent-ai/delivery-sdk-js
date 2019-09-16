import { Pagination } from '../common';
import { IKontentResponse, IKontentResponseDebug } from '../common/common-models';
import { IContentItem, IContentItemsContainer } from './item-models';

export namespace ItemResponses {

    export class ListContentItemsResponse<TItem extends IContentItem = IContentItem> implements IKontentResponse {

        /**
         * Indicates if response contains any items
         */
        public isEmpty: boolean;

        /**
        * First item or undefined if none is found
        */
        public firstItem?: TItem;

        /**
        * Last item or undefined if response contains no items
        */
        public lastItem?: TItem;

        /**
        * Response containing multiple item
        * @constructor
        * @param {TItem[]} items - Collection of content items
        * @param {Pagination} pagination - Pagination object
        * @param {IContentItemsContainer} linkedItems - Content items that were processed during request
        * @param {IKontentResponseDebug} debug - Debug information from the request
        */
        constructor(
            public items: TItem[],
            public pagination: Pagination,
            public linkedItems: IContentItemsContainer,
            public debug: IKontentResponseDebug
        ) {
            this.isEmpty = this.getIsEmpty();
            this.lastItem = this.getLastItem();
            this.firstItem = this.getFirstItem();
        }

        getIsEmpty(): boolean {
            if (!this.items) {
                return true;
            }
            return this.items.length <= 0;
        }

        getFirstItem(): TItem | undefined {
            if (!this.items) {
                return;
            }

            if (this.items.length < 1) {
                return;
            }

            return this.items[0];
        }

        getLastItem(): TItem | undefined {
            if (!this.items) {
                return;
            }

            if (this.items.length < 1) {
                return;
            }

            return this.items[this.items.length - 1];
        }
    }

    export class ViewContentItemResponse<TItem extends IContentItem = IContentItem> implements IKontentResponse {

        /**
         * Indicates if response contains item
         */
        public isEmpty: boolean;

        /**
        * Response containing single item
        * @constructor
        * @param {TItem} item - Returned item
        * @param {IContentItemsContainer} linkedItems - Content items that were processed during request
        * @param {IKontentResponseDebug} debug - Debug information from the request
        */
        constructor(
            public item: TItem,
            public linkedItems: IContentItemsContainer,
            public debug: IKontentResponseDebug
        ) {
            this.isEmpty = this.getIsEmpty();
        }

        getIsEmpty(): boolean {
            if (!this.item) {
                return true;
            }
            return false;
        }
    }
}

