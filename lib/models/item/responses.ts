import {
    Pagination,
    IKontentListAllResponse,
    IKontentListResponse,
    IKontentResponse,
    IKontentNetworkResponse
} from '../common';
import { IContentItem, IContentItemsContainer } from './item-models';

export namespace ItemResponses {
    export class ListItemsFeedResponse<TContentItem extends IContentItem<any> = IContentItem<any>> implements IKontentListResponse {
        constructor(public items: TContentItem[], public linkedItems: IContentItemsContainer) {}
    }

    export class ListItemsFeedAllResponse<TContentItem extends IContentItem<any> = IContentItem<any>> implements IKontentListAllResponse {
        constructor(
            public items: TContentItem[],
            public responses: IKontentNetworkResponse<ListItemsFeedResponse<TContentItem>>[]
        ) {}
    }

    export class ListContentItemsResponse<TContentItem extends IContentItem<any> = IContentItem<any>> implements IKontentListResponse {
        /**
         * Response containing multiple item
         * @constructor
         * @param {TItem[]} items - Collection of content items
         * @param {Pagination} pagination - Pagination object
         * @param {IContentItemsContainer} linkedItems - Content items that were processed during request
         */
        constructor(
            public items: TContentItem[],
            public pagination: Pagination,
            public linkedItems: IContentItemsContainer
        ) {}

        /**
         * Flattens linkedItems object to an array
         */
        getLinkedItemsAsArray(): IContentItem<any>[] {
            return Object.values(this.items);
        }
    }

    export class ListContentItemsAllResponse<TContentItem extends IContentItem<any> = IContentItem<any>>
        implements IKontentListAllResponse
    {
        constructor(
            public items: TContentItem[],
            public responses: IKontentNetworkResponse<ListContentItemsResponse<TContentItem>>[]
        ) {}
    }

    export class ViewContentItemResponse<TContentItem extends IContentItem<any> = IContentItem<any>> implements IKontentResponse {
        /**
         * Response containing single item
         * @constructor
         * @param {TItem} item - Returned item
         * @param {IContentItemsContainer} linkedItems - Content items that were processed during request
         */
        constructor(public item: TContentItem, public linkedItems: IContentItemsContainer) {}
    }
}
