import { Contracts } from '../contracts';
import { IDeliveryNetworkResponse } from './common/base-responses';
import { IKontentListAllResponse, IKontentListResponse, IKontentResponse } from './common/common-models';
import { IPagination } from './common/pagination.class';
import { IContentType } from './content-type-models';
import { IGenericElement } from './element-models';
import { IContentItem, IContentItemsContainer } from './item-models';
import { ILanguage } from './language-models';
import { IContentItemDelta } from './sync-models';
import { ITaxonomyGroup } from './taxonomy-models';

export namespace Responses {
    export interface IListContentTypesResponse extends IKontentListResponse {
        items: IContentType[];
        pagination: IPagination;
    }

    export interface IListContentTypesAllResponse extends IKontentListAllResponse {
        items: IContentType[];
        responses: IDeliveryNetworkResponse<IListContentTypesResponse, Contracts.IListContentTypeContract>[];
    }

    export interface IViewContentTypeResponse extends IKontentResponse {
        type: IContentType;
    }

    export interface IViewContentTypeElementResponse extends IKontentResponse {
        /**
         * Response containing content type element
         *
         * @constructor
         * @param {IGenericElement} element - Content type element
         */
        element: IGenericElement;
    }

    export interface IListItemsFeedResponse<TContentItem extends IContentItem = IContentItem>
        extends IKontentListResponse {
        items: TContentItem[];
        linkedItems: IContentItemsContainer;
    }

    export interface IListItemsFeedAllResponse<TContentItem extends IContentItem = IContentItem>
        extends IKontentListAllResponse {
        items: TContentItem[];
        responses: IDeliveryNetworkResponse<IListItemsFeedResponse<TContentItem>, Contracts.IItemsFeedContract>[];
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
        responses: IDeliveryNetworkResponse<
            IListContentItemsResponse<TContentItem>,
            Contracts.IListContentItemsContract
        >[];
    }

    export interface IViewContentItemResponse<TContentItem extends IContentItem = IContentItem>
        extends IKontentResponse {
        item: TContentItem;
        linkedItems: IContentItemsContainer;
    }

    export interface IInitializeSyncResponse extends IKontentResponse {
        items: IContentItemDelta[];
    }

    export interface ISyncChangesResponse extends IKontentResponse {
        items: IContentItemDelta[];
    }

    export interface ISyncChangesAllResponse extends IKontentListAllResponse {
        items: IContentItemDelta[];
        responses: IDeliveryNetworkResponse<ISyncChangesResponse, Contracts.ISyncChangesContract>[];
    }

    export interface IListLanguagesResponse extends IKontentListResponse {
        items: ILanguage[];
        pagination: IPagination;
    }

    export interface IListLanguagesAllResponse extends IKontentListAllResponse {
        items: ILanguage[];
        responses: IDeliveryNetworkResponse<IListLanguagesResponse, Contracts.IListLanguagesContract>[];
    }

    export interface IViewTaxonomyResponse extends IKontentResponse {
        taxonomy: ITaxonomyGroup;
    }

    export interface IListTaxonomiesResponse extends IKontentListResponse {
        items: ITaxonomyGroup[];
        pagination: IPagination;
    }

    export interface IListTaxonomiesAllResponse extends IKontentListAllResponse {
        items: ITaxonomyGroup[];
        responses: IDeliveryNetworkResponse<IListTaxonomiesResponse, Contracts.IListTaxonomyGroupsContract>[];
    }
}
