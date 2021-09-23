import {
    IPagination,
    IKontentListAllResponse,
    IKontentListResponse,
    IKontentResponse,
    IKontentNetworkResponse
} from '../common';
import { IContentItem, IContentItemsContainer } from './item-models';

export namespace ItemResponses {
    export interface IListItemsFeedResponse<TContentItem extends IContentItem = IContentItem>
        extends IKontentListResponse {
        items: TContentItem[];
        linkedItems: IContentItemsContainer;
    }

    export interface IListItemsFeedAllResponse<TContentItem extends IContentItem = IContentItem>
        extends IKontentListAllResponse {
        items: TContentItem[];
        responses: IKontentNetworkResponse<IListItemsFeedResponse<TContentItem>>[];
    }

    export interface IListContentItemsResponse<TContentItem extends IContentItem = IContentItem>
        extends IKontentListResponse {
        items: TContentItem[];
        pagination: IPagination;
        linkedItems: IContentItemsContainer;
    }

    export interface IListContentItemsAllResponse<TContentItem extends IContentItem = IContentItem>
        extends IKontentListAllResponse {
        items: TContentItem[];
        responses: IKontentNetworkResponse<IListContentItemsResponse<TContentItem>>[];
    }

    export interface IViewContentItemResponse<TContentItem extends IContentItem = IContentItem>
        extends IKontentResponse {
        item: TContentItem;
        linkedItems: IContentItemsContainer;
    }
}
