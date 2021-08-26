import { IBaseResponse } from '@kentico/kontent-core';
import { BaseKontentResponseArrayDebug, BaseKontentResponseStandardDebug, Pagination } from '../common';
import { IContentItem, IContentItemsContainer } from './item-models';
export declare namespace ItemResponses {
    class ItemsFeedAllResponse<TItem extends IContentItem = IContentItem> extends BaseKontentResponseArrayDebug {
        items: TItem[];
        linkedItems: IContentItemsContainer;
        constructor(items: TItem[], linkedItems: IContentItemsContainer, responses: IBaseResponse<any>[], isDeveloperMode: boolean);
    }
    class ItemsFeedResponse<TItem extends IContentItem = IContentItem> extends BaseKontentResponseStandardDebug {
        items: TItem[];
        linkedItems: IContentItemsContainer;
        private readonly continuationTokenHeaderName;
        continuationToken?: string;
        constructor(items: TItem[], linkedItems: IContentItemsContainer, response: IBaseResponse<any>, isDeveloperMode: boolean);
        private getContinuationToken;
    }
    class ListContentItemsResponse<TItem extends IContentItem = IContentItem> extends BaseKontentResponseStandardDebug {
        items: TItem[];
        pagination: Pagination;
        linkedItems: IContentItemsContainer;
        /**
         * Indicates if response contains any items
         */
        isEmpty: boolean;
        /**
         * First item or undefined if none is found
         */
        firstItem?: TItem;
        /**
         * Last item or undefined if response contains no items
         */
        lastItem?: TItem;
        /**
         * Response containing multiple item
         * @constructor
         * @param {TItem[]} items - Collection of content items
         * @param {Pagination} pagination - Pagination object
         * @param {IContentItemsContainer} linkedItems - Content items that were processed during request
         */
        constructor(items: TItem[], pagination: Pagination, linkedItems: IContentItemsContainer, response: IBaseResponse<any>, isDeveloperMode: boolean);
        /**
         * Flattens linkedItems object to an array
         */
        getLinkedItemsAsArray(): IContentItem[];
        getIsEmpty(): boolean;
        getFirstItem(): TItem | undefined;
        getLastItem(): TItem | undefined;
    }
    class ViewContentItemResponse<TItem extends IContentItem = IContentItem> extends BaseKontentResponseStandardDebug {
        item: TItem;
        linkedItems: IContentItemsContainer;
        /**
         * Indicates if response contains item
         */
        isEmpty: boolean;
        /**
         * Response containing single item
         * @constructor
         * @param {TItem} item - Returned item
         * @param {IContentItemsContainer} linkedItems - Content items that were processed during request
         */
        constructor(item: TItem, linkedItems: IContentItemsContainer, response: IBaseResponse<any>, isDeveloperMode: boolean);
        getIsEmpty(): boolean;
    }
}
