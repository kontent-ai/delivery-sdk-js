import { IResponse, IHeader } from '@kentico/kontent-core';

import {
    BaseKontentResponse,
    continuationTokenHeaderName,
    Pagination,
    BaseGroupedKontentResponse,
    IKontentListAllResponse,
    IKontentListResponse
} from '../common';
import { IContentItem, IContentItemsContainer } from './item-models';

export namespace ItemResponses {
    export class ListItemsFeedResponse<TItem extends IContentItem = IContentItem>
        extends BaseKontentResponse
        implements IKontentListResponse
    {
        public continuationToken?: string;

        constructor(public items: TItem[], public linkedItems: IContentItemsContainer, response: IResponse<any>) {
            super(response);
            this.continuationToken = this.getContinuationToken(response.headers);
        }

        private getContinuationToken(headers: IHeader[]): string | undefined {
            const header = headers.find((m) => m.header.toLowerCase() === continuationTokenHeaderName.toLowerCase());
            return header ? header.value : undefined;
        }
    }

    export class ListItemsFeedAllResponse<TItem extends IContentItem = IContentItem>
        extends BaseGroupedKontentResponse
        implements IKontentListAllResponse
    {
        constructor(public items: TItem[], public responses: ListItemsFeedResponse<TItem>[]) {
            super(responses);
        }
    }

    export class ListContentItemsResponse<TItem extends IContentItem = IContentItem> extends BaseKontentResponse {
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
            response: IResponse<any>
        ) {
            super(response);
        }

        /**
         * Flattens linkedItems object to an array
         */
        getLinkedItemsAsArray(): IContentItem[] {
            return Object.values(this.items);
        }
    }

    export class ListContentItemsAllResponse<TItem extends IContentItem = IContentItem>
        extends BaseGroupedKontentResponse
        implements IKontentListAllResponse
    {
        constructor(public items: TItem[], public responses: ListContentItemsResponse<TItem>[]) {
            super(responses);
        }
    }

    export class ViewContentItemResponse<TItem extends IContentItem = IContentItem> extends BaseKontentResponse {
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
        constructor(public item: TItem, public linkedItems: IContentItemsContainer, response: IResponse<any>) {
            super(response);
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
