import {
    IPagination,
    IKontentListAllResponse,
    IKontentListResponse,
    IKontentResponse,
    IKontentNetworkResponse
} from '../common';
import { IContentItem, IContentItemsContainer } from './item-models';

export namespace ItemResponses {
    export interface IListItemsFeedResponse<TContentItem extends IContentItem<any> = IContentItem<any>>
        extends IKontentListResponse {
        items: TContentItem[];
        linkedItems: IContentItemsContainer;
    }

    export interface IListItemsFeedAllResponse<TContentItem extends IContentItem<any> = IContentItem<any>>
        extends IKontentListAllResponse {
        items: TContentItem[];
        responses: IKontentNetworkResponse<IListItemsFeedResponse<TContentItem>>[];
    }

    export interface IListContentItemsResponse<TContentItem extends IContentItem<any> = IContentItem<any>>
        extends IKontentListResponse {
        items: TContentItem[];
        pagination: IPagination;
        linkedItems: IContentItemsContainer;
    }

    export interface IListContentItemsAllResponse<TContentItem extends IContentItem<any> = IContentItem<any>>
        extends IKontentListAllResponse {
        items: TContentItem[];
        responses: IKontentNetworkResponse<IListContentItemsResponse<TContentItem>>[];
    }

    export interface IViewContentItemResponse<TContentItem extends IContentItem<any> = IContentItem<any>>
        extends IKontentResponse {
        item: TContentItem;
        linkedItems: IContentItemsContainer;
    }
}
