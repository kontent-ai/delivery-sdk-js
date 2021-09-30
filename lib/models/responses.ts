
import { ItemContracts, LanguageContracts, TaxonomyContracts, TypeContracts } from '../data-contracts';
import { INetworkResponse } from './common/base-responses';
import { IKontentListAllResponse, IKontentListResponse, IKontentResponse } from './common/common-models';
import { IPagination } from './common/pagination.class';
import { IContentType } from './content-type-models';
import { IGenericElement } from './element-models';
import { IContentItem, IContentItemsContainer } from './item-models';
import { ILanguage } from './language-models';
import { ITaxonomyGroup } from './taxonomy-models';

export namespace Responses {
    export interface IListContentTypesResponse extends IKontentListResponse {
        items: IContentType[];
        pagination: IPagination;
    }

    export interface IListContentTypesAllResponse extends IKontentListAllResponse {
        items: IContentType[];
        responses: INetworkResponse<IListContentTypesResponse, TypeContracts.IListContentTypeContract>[];
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
        responses: INetworkResponse<IListContentItemsResponse<TContentItem>, ItemContracts.IListContentItemsContract>[];
    }

    export interface IViewContentItemResponse<TContentItem extends IContentItem = IContentItem>
        extends IKontentResponse {
        item: TContentItem;
        linkedItems: IContentItemsContainer;
    }

    export interface IListLanguagesResponse extends IKontentListResponse {
        items: ILanguage[];
        pagination: IPagination;
    }

    export interface IListLanguagesAllResponse extends IKontentListAllResponse {
        items: ILanguage[];
        responses: INetworkResponse<IListLanguagesResponse, LanguageContracts.IListLanguagesContract>[];
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
        responses: INetworkResponse<IListTaxonomiesResponse, TaxonomyContracts.IListTaxonomyGroupsContract>[];
    }
}
