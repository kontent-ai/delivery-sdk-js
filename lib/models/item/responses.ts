import { IBaseResponse, IHeader } from '@kentico/kontent-core';

import { BaseKontentResponseArrayDebug, BaseKontentResponseStandardDebug, Pagination } from '../common';
import { IContentItem, IContentItemsContainer } from './item-models';

export namespace ItemResponses {
    export class ItemsFeedAllResponse<TItem extends IContentItem = IContentItem> extends BaseKontentResponseArrayDebug {
        constructor(
            public items: TItem[],
            public linkedItems: IContentItemsContainer,
            responses: IBaseResponse<any>[],
            isDeveloperMode: boolean
        ) {
            super(responses, isDeveloperMode);
        }
    }

    export class ItemsFeedResponse<TItem extends IContentItem = IContentItem> extends BaseKontentResponseStandardDebug {
        private readonly continuationTokenHeaderName: string = 'X-Continuation';
        public continuationToken?: string;

        constructor(
            public items: TItem[],
            public linkedItems: IContentItemsContainer,
            response: IBaseResponse<any>,
            isDeveloperMode: boolean
        ) {
            super(response, isDeveloperMode);
            this.continuationToken = this.getContinuationToken(response.headers);
        }

        private getContinuationToken(headers: IHeader[]): string | undefined {
            const header = headers.find(m => m.header.toLowerCase() === this.continuationTokenHeaderName.toLowerCase());
            return header ? header.value : undefined;
        }
    }

    export class ListContentItemsResponse<
        TItem extends IContentItem = IContentItem
    > extends BaseKontentResponseStandardDebug {
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
         */
        constructor(
            public items: TItem[],
            public pagination: Pagination,
            public linkedItems: IContentItemsContainer,
            response: IBaseResponse<any>,
            isDeveloperMode: boolean
        ) {
            super(response, isDeveloperMode);
            this.isEmpty = this.getIsEmpty();
            this.lastItem = this.getLastItem();
            this.firstItem = this.getFirstItem();
        }

        /**
         * Flattens linkedItems object to an array
         */
        getLinkedItemsAsArray(): IContentItem[] {
            return Object.values(this.items);
        }

        getIsEmpty(): boolean {
            if (!this.items) {
                return true;
            }
            return this.items.length === 0;
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

    export class ViewContentItemResponse<
        TItem extends IContentItem = IContentItem
    > extends BaseKontentResponseStandardDebug {
        /**
         * Indicates if response contains item
         */
        public isEmpty: boolean;

        /**
         * Response containing single item
         * @constructor
         * @param {TItem} item - Returned item
         * @param {IContentItemsContainer} linkedItems - Content items that were processed during request
         */
        constructor(
            public item: TItem,
            public linkedItems: IContentItemsContainer,
            response: IBaseResponse<any>,
            isDeveloperMode: boolean
        ) {
            super(response, isDeveloperMode);
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
