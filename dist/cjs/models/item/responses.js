"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemResponses = void 0;
const common_1 = require("../common");
var ItemResponses;
(function (ItemResponses) {
    class ItemsFeedAllResponse extends common_1.BaseKontentResponseArrayDebug {
        constructor(items, linkedItems, responses, isDeveloperMode) {
            super(responses, isDeveloperMode);
            this.items = items;
            this.linkedItems = linkedItems;
        }
    }
    ItemResponses.ItemsFeedAllResponse = ItemsFeedAllResponse;
    class ItemsFeedResponse extends common_1.BaseKontentResponseStandardDebug {
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
    class ListContentItemsResponse extends common_1.BaseKontentResponseStandardDebug {
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
    class ViewContentItemResponse extends common_1.BaseKontentResponseStandardDebug {
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
})(ItemResponses = exports.ItemResponses || (exports.ItemResponses = {}));
//# sourceMappingURL=responses.js.map