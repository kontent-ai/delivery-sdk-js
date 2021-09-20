import {
    Pagination,
    IKontentListAllResponse,
    IKontentListResponse,
    IKontentResponse,
    IKontentNetworkResponse
} from '../common';
import { IContentItem, IContentItemElements, IContentItemsContainer } from './item-models';

export namespace ItemResponses {
    export class ListItemsFeedResponse<TElements extends IContentItemElements> implements IKontentListResponse {
        constructor(public items: IContentItem<TElements>[], public linkedItems: IContentItemsContainer) {}
    }

    export class ListItemsFeedAllResponse<TElements extends IContentItemElements> implements IKontentListAllResponse {
        constructor(
            public items: IContentItem<TElements>[],
            public responses: IKontentNetworkResponse<ListItemsFeedResponse<TElements>>[]
        ) {}
    }

    export class ListContentItemsResponse<TElements extends IContentItemElements> implements IKontentListResponse {
        /**
         * Response containing multiple item
         * @constructor
         * @param {TItem[]} items - Collection of content items
         * @param {Pagination} pagination - Pagination object
         * @param {IContentItemsContainer} linkedItems - Content items that were processed during request
         */
        constructor(
            public items: IContentItem<TElements>[],
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

    export class ListContentItemsAllResponse<TElements extends IContentItemElements>
        implements IKontentListAllResponse
    {
        constructor(
            public items: IContentItem<TElements>[],
            public responses: IKontentNetworkResponse<ListContentItemsResponse<TElements>>[]
        ) {}
    }

    export class ViewContentItemResponse<TElements extends IContentItemElements> implements IKontentResponse {
        /**
         * Response containing single item
         * @constructor
         * @param {TItem} item - Returned item
         * @param {IContentItemsContainer} linkedItems - Content items that were processed during request
         */
        constructor(public item: IContentItem<TElements>, public linkedItems: IContentItemsContainer) {}
    }
}
