import { Contracts } from '../contracts';
import { IDeliveryNetworkResponse } from './common/base-responses';
import { IKontentListAllResponse, IKontentListResponse, IKontentResponse } from './common/common-models';
import { IPagination } from './common/pagination.class';
import { IContentType } from './content-type-models';
import { IGenericElementOption } from './element-models';
import { IContentItem, IContentItemsContainer } from './item-models';
import { ILanguage } from './language-models';
import { IContentItemDelta } from './sync-models';
import { ITaxonomyGroup } from './taxonomy-models';

export namespace Responses {
    export interface IListContentTypesResponse<TContentTypeCodename extends string> extends IKontentListResponse {
        items: IContentType<TContentTypeCodename>[];
        pagination: IPagination;
    }

    export interface IListContentTypesAllResponse<TContentTypeCodename extends string> extends IKontentListAllResponse {
        items: IContentType<TContentTypeCodename>[];
        responses: IDeliveryNetworkResponse<
            IListContentTypesResponse<TContentTypeCodename>,
            Contracts.IListContentTypeContract
        >[];
    }

    export interface IViewContentTypeResponse<TContentTypeCodename extends string> extends IKontentResponse {
        type: IContentType<TContentTypeCodename>;
    }

    export interface IViewContentTypeElementResponse extends IKontentResponse {
        codename?: string;
        type: string;
        name: string;
        taxonomyGroup?: string;
        options: IGenericElementOption[];
    }

    export interface IListItemsFeedResponse<
        TContentItem extends IContentItem = IContentItem,
        TLinkedItemType extends IContentItem = IContentItem
    > extends IKontentListResponse {
        items: TContentItem[];
        linkedItems: IContentItemsContainer<TLinkedItemType>;
    }

    export interface IListItemsFeedAllResponse<
        TContentItem extends IContentItem = IContentItem,
        TLinkedItemType extends IContentItem = IContentItem
    > extends IKontentListAllResponse {
        items: TContentItem[];
        responses: IDeliveryNetworkResponse<
            IListItemsFeedResponse<TContentItem, TLinkedItemType>,
            Contracts.IItemsFeedContract
        >[];
    }

    export interface IListContentItemsResponse<
        TContentItem extends IContentItem = IContentItem,
        TLinkedItemType extends IContentItem = IContentItem
    > extends IKontentListResponse {
        items: TContentItem[];
        pagination: IPagination;
        linkedItems: IContentItemsContainer<TLinkedItemType>;
    }

    export interface IListContentItemsAllResponse<
        TContentItem extends IContentItem = IContentItem,
        TLinkedItemType extends IContentItem = IContentItem
    > extends IKontentListAllResponse {
        items: TContentItem[];
        responses: IDeliveryNetworkResponse<
            IListContentItemsResponse<TContentItem, TLinkedItemType>,
            Contracts.IListContentItemsContract
        >[];
    }

    export interface IViewContentItemResponse<
        TContentItem extends IContentItem = IContentItem,
        TLinkedItemType extends IContentItem = IContentItem
    > extends IKontentResponse {
        item: TContentItem;
        linkedItems: IContentItemsContainer<TLinkedItemType>;
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

    export interface IListLanguagesResponse<TLanguageCodenames extends string> extends IKontentListResponse {
        items: ILanguage<TLanguageCodenames>[];
        pagination: IPagination;
    }

    export interface IListLanguagesAllResponse<TLanguageCodenames extends string> extends IKontentListAllResponse {
        items: ILanguage<TLanguageCodenames>[];
        responses: IDeliveryNetworkResponse<
            IListLanguagesResponse<TLanguageCodenames>,
            Contracts.IListLanguagesContract
        >[];
    }

    export interface IViewTaxonomyResponse<TaxonomyCodename extends string> extends IKontentResponse {
        taxonomy: ITaxonomyGroup<TaxonomyCodename>;
    }

    export interface IListTaxonomiesResponse<TaxonomyCodename extends string> extends IKontentListResponse {
        items: ITaxonomyGroup<TaxonomyCodename>[];
        pagination: IPagination;
    }

    export interface IListTaxonomiesAllResponse<TaxonomyCodename extends string> extends IKontentListAllResponse {
        items: ITaxonomyGroup<TaxonomyCodename>[];
        responses: IDeliveryNetworkResponse<
            IListTaxonomiesResponse<TaxonomyCodename>,
            Contracts.IListTaxonomyGroupsContract
        >[];
    }
}
