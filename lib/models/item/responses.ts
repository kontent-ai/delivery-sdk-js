import { ItemContracts } from '../../data-contracts';
import {
    IPagination,
    IKontentListAllResponse,
    IKontentListResponse,
    IKontentResponse,
    INetworkResponse
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
        responses: INetworkResponse<IListItemsFeedResponse<TContentItem>, ItemContracts.IItemsFeedContract>[];
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
        responses: INetworkResponse<
            IListContentItemsResponse<TContentItem>,
            ItemContracts.IListContentItemsContract
        >[];
    }

    export interface IViewContentItemResponse<TContentItem extends IContentItem = IContentItem>
        extends IKontentResponse {
        item: TContentItem;
        linkedItems: IContentItemsContainer;
    }
}
