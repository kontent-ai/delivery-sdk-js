import { BaseKontentResponseArrayDebug, BaseKontentResponseStandardDebug } from '../common';
export var ItemResponses;
(function (ItemResponses) {
    class ItemsFeedAllResponse extends BaseKontentResponseArrayDebug {
        constructor(items, linkedItems, responses, isDeveloperMode) {
            super(responses, isDeveloperMode);
            this.items = items;
            this.linkedItems = linkedItems;
        }
    }
    ItemResponses.ItemsFeedAllResponse = ItemsFeedAllResponse;
    class ItemsFeedResponse extends BaseKontentResponseStandardDebug {
        constructor(items, linkedItems, response, isDeveloperMode) {
            super(response, isDeveloperMode);
            this.items = items;
            this.linkedItems = linkedItems;
            this.continuationTokenHeaderName = 'X-Continuation';
            this.continuationToken = this.getContinuationToken(response.headers);
        }
        getContinuationToken(headers) {
            const header = headers.find(m => m.header.toLowerCase() === this.continuationTokenHeaderName.toLowerCase());
            return header ? header.value : undefined;
        }
    }
    ItemResponses.ItemsFeedResponse = ItemsFeedResponse;
    class ListContentItemsResponse extends BaseKontentResponseStandardDebug {
        /**
         * Response containing multiple item
         * @constructor
         * @param {TItem[]} items - Collection of content items
         * @param {Pagination} pagination - Pagination object
         * @param {IContentItemsContainer} linkedItems - Content items that were processed during request
         */
        constructor(items, pagination, linkedItems, response, isDeveloperMode) {
            super(response, isDeveloperMode);
            this.items = items;
            this.pagination = pagination;
            this.linkedItems = linkedItems;
            this.isEmpty = this.getIsEmpty();
            this.lastItem = this.getLastItem();
            this.firstItem = this.getFirstItem();
        }
        /**
         * Flattens linkedItems object to an array
         */
        getLinkedItemsAsArray() {
            return Object.values(this.items);
        }
        getIsEmpty() {
            if (!this.items) {
                return true;
            }
            return this.items.length === 0;
        }
        getFirstItem() {
            if (!this.items) {
                return;
            }
            if (this.items.length < 1) {
                return;
            }
            return this.items[0];
        }
        getLastItem() {
            if (!this.items) {
                return;
            }
            if (this.items.length < 1) {
                return;
            }
            return this.items[this.items.length - 1];
        }
    }
    ItemResponses.ListContentItemsResponse = ListContentItemsResponse;
    class ViewContentItemResponse extends BaseKontentResponseStandardDebug {
        /**
         * Response containing single item
         * @constructor
         * @param {TItem} item - Returned item
         * @param {IContentItemsContainer} linkedItems - Content items that were processed during request
         */
        constructor(item, linkedItems, response, isDeveloperMode) {
            super(response, isDeveloperMode);
            this.item = item;
            this.linkedItems = linkedItems;
            this.isEmpty = this.getIsEmpty();
        }
        getIsEmpty() {
            if (!this.item) {
                return true;
            }
            return false;
        }
    }
    ItemResponses.ViewContentItemResponse = ViewContentItemResponse;
})(ItemResponses || (ItemResponses = {}));
//# sourceMappingURL=responses.js.map