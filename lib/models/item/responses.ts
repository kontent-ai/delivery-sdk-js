import { Pagination, IKontentListAllResponse, IKontentListResponse, IKontentResponse, IKontentNetworkResponse } from '../common';
import { IContentItem, IContentItemsContainer } from './item-models';

export namespace ItemResponses {
    export class ListItemsFeedResponse<TItem extends IContentItem = IContentItem> implements IKontentListResponse {
        constructor(public items: TItem[], public linkedItems: IContentItemsContainer) {}
    }

    export class ListItemsFeedAllResponse<TItem extends IContentItem = IContentItem>
        implements IKontentListAllResponse
    {
        constructor(public items: TItem[], public responses: IKontentNetworkResponse<ListItemsFeedResponse<TItem>>[]) {}
    }

    export class ListContentItemsResponse<TItem extends IContentItem = IContentItem> implements IKontentListResponse {
        /**
         * Response containing multiple item
         * @constructor
         * @param {TItem[]} items - Collection of content items
         * @param {Pagination} pagination - Pagination object
         * @param {IContentItemsContainer} linkedItems - Content items that were processed during request
         */
        constructor(public items: TItem[], public pagination: Pagination, public linkedItems: IContentItemsContainer) {}

        /**
         * Flattens linkedItems object to an array
         */
        getLinkedItemsAsArray(): IContentItem[] {
            return Object.values(this.items);
        }
    }

    export class ListContentItemsAllResponse<TItem extends IContentItem = IContentItem>
        implements IKontentListAllResponse
    {
        constructor(public items: TItem[], public responses: IKontentNetworkResponse<ListContentItemsResponse<TItem>>[]) {}
    }

    export class ViewContentItemResponse<TItem extends IContentItem = IContentItem> implements IKontentResponse {
        /**
         * Response containing single item
         * @constructor
         * @param {TItem} item - Returned item
         * @param {IContentItemsContainer} linkedItems - Content items that were processed during request
         */
        constructor(public item: TItem, public linkedItems: IContentItemsContainer) {
        }
    }
}
