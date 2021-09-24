import { IHttpService } from '@kentico/kontent-core';

import { IDeliveryClientConfig } from '../config';
import {
    ElementContracts,
    ItemContracts,
    LanguageContracts,
    TaxonomyContracts,
    TypeContracts
} from '../data-contracts';
import {
    ElementResponses,
    IContentItem,
    IContentTypeQueryConfig,
    IGroupedKontentNetworkResponse,
    IItemQueryConfig,
    IKontentNetworkResponse,
    ILanguagesQueryConfig,
    ITaxonomyQueryConfig,
    ItemResponses,
    LanguageResponses,
    TaxonomyResponses,
    TypeResponses
} from '../models';
import {
    IKontentListAllResponse,
    IKontentListResponse,
    IListQueryConfig,
    ISDKInfo
} from '../models/common/common-models';
import { BaseDeliveryQueryService } from './base-delivery-query.service';
import { IMappingService } from './mapping.service';

export class QueryService extends BaseDeliveryQueryService {
    constructor(
        config: IDeliveryClientConfig,
        httpService: IHttpService<any>,
        sdkInfo: ISDKInfo,
        mappingService: IMappingService
    ) {
        super(config, httpService, sdkInfo, mappingService);
    }

    /**
     * Gets single item from given url
     * @param url Url used to get single item
     * @param queryConfig Query configuration
     */
    async getSingleItemAsync<TContentItem extends IContentItem = IContentItem>(
        url: string,
        queryConfig: IItemQueryConfig
    ): Promise<IKontentNetworkResponse<ItemResponses.IViewContentItemResponse<TContentItem>, ItemContracts.IViewContentItemContract>> {
        const response = await this.getResponseAsync<ItemContracts.IViewContentItemContract>(url, queryConfig);

        return this.mapNetworkResponse<ItemResponses.IViewContentItemResponse<TContentItem>, ItemContracts.IViewContentItemContract>(
            this.mappingService.viewContentItemResponse<TContentItem>(response.data),
            response
        );
    }

    /**
     * Gets single feed response. Might not contain all items in your project.
     * @param url Url
     * @param queryConfig Query configuration
     */
    async getItemsFeed<TContentItem extends IContentItem = IContentItem>(
        url: string,
        queryConfig: IItemQueryConfig
    ): Promise<IKontentNetworkResponse<ItemResponses.IListItemsFeedResponse<TContentItem>, ItemContracts.IItemsFeedContract>> {
        const response = await this.getResponseAsync<ItemContracts.IItemsFeedContract>(url, queryConfig);

        return this.mapNetworkResponse(
            this.mappingService.itemsFeedResponse<TContentItem>(response.data),
            response
        );
    }

    /**
     * Gets multiple items from given url
     * @param url Url used to get multiple items
     * @param queryConfig Query configuration
     */
    async getMultipleItems<TContentItem extends IContentItem = IContentItem>(
        url: string,
        queryConfig: IItemQueryConfig
    ): Promise<IKontentNetworkResponse<ItemResponses.IListContentItemsResponse<TContentItem>, ItemContracts.IListContentItemsContract>> {
        const response = await this.getResponseAsync<ItemContracts.IListContentItemsContract>(url, queryConfig);

        return this.mapNetworkResponse(
            this.mappingService.listContentItemsResponse(response.data),
            response
        );
    }

    /**
     * Gets single content type from given url
     * @param url Url used to get single type
     * @param queryConfig Query configuration
     */
    async getSingleType(
        url: string,
        queryConfig: IContentTypeQueryConfig
    ): Promise<IKontentNetworkResponse<TypeResponses.IViewContentTypeResponse, TypeContracts.IViewContentTypeContract>> {
        const response = await this.getResponseAsync<TypeContracts.IViewContentTypeContract>(url, queryConfig);

        return this.mapNetworkResponse(this.mappingService.viewContentTypeResponse(response.data), response);
    }

    /**
     * Gets multiple content types from given url
     * @param url Url used to get multiple types
     * @param queryConfig Query configuration
     */
    async getMultipleTypes(
        url: string,
        queryConfig: IContentTypeQueryConfig
    ): Promise<IKontentNetworkResponse<TypeResponses.IListContentTypesResponse, TypeContracts.IListContentTypeContract>> {
        const response = await this.getResponseAsync<TypeContracts.IListContentTypeContract>(url, queryConfig);

        return this.mapNetworkResponse(this.mappingService.listContentTypesResponse(response.data), response);
    }

    /**
     * Gets languages
     * @param url Url
     * @param queryConfig Query configuration
     */
    async getLanguages(
        url: string,
        queryConfig: ILanguagesQueryConfig
    ): Promise<IKontentNetworkResponse<LanguageResponses.IListLanguagesResponse, LanguageContracts.IListLanguagesContract>> {
        const response = await this.getResponseAsync<LanguageContracts.IListLanguagesContract>(url, queryConfig);

        return this.mapNetworkResponse(this.mappingService.listLanguagesResponse(response.data), response);
    }

    /**
     * Gets single taxonomy from given url
     * @param url Url used to get single taxonomy
     * @param queryConfig Query configuration
     */
    async getTaxonomy(
        url: string,
        queryConfig: ITaxonomyQueryConfig
    ): Promise<IKontentNetworkResponse<TaxonomyResponses.IViewTaxonomyResponse, TaxonomyContracts.IViewTaxonomyGroupContract>> {
        const response = await this.getResponseAsync<TaxonomyContracts.IViewTaxonomyGroupContract>(url, queryConfig);

        return this.mapNetworkResponse(this.mappingService.viewTaxonomyGroupResponse(response.data), response);
    }

    /**
     * Gets multiple taxonomies from given url
     * @param url Url used to get multiple taxonomies
     * @param queryConfig Query configuration
     */
    async getTaxonomies(
        url: string,
        queryConfig: ITaxonomyQueryConfig
    ): Promise<IKontentNetworkResponse<TaxonomyResponses.IListTaxonomiesResponse, TaxonomyContracts.IListTaxonomyGroupsContract>> {
        const response = await this.getResponseAsync<TaxonomyContracts.IListTaxonomyGroupsContract>(url, queryConfig);

        return this.mapNetworkResponse(this.mappingService.listTaxonomyGroupsResponse(response.data), response);
    }

    /**
     * Gets single content type element from given url
     * @param url Url used to get single content type element
     * @param queryConfig Query configuration
     */
    async getElementAsync(
        url: string,
        queryConfig: ITaxonomyQueryConfig
    ): Promise<IKontentNetworkResponse<ElementResponses.IViewContentTypeElementResponse, ElementContracts.IViewContentTypeElementContract>> {
        const response = await this.getResponseAsync<ElementContracts.IViewContentTypeElementContract>(
            url,
            queryConfig
        );

        return this.mapNetworkResponse(this.mappingService.viewContentTypeElementResponse(response.data), response);
    }

    async getListAllResponse<
        TResponse extends IKontentListResponse,
        TAllResponse extends IKontentListAllResponse,
        TContract
    >(data: {
        getResponse: (nextPageUrl?: string, continuationToken?: string) => Promise<IKontentNetworkResponse<TResponse, TContract>>;
        allResponseFactory: (items: any[], responses: IKontentNetworkResponse<TResponse, TContract>[]) => IGroupedKontentNetworkResponse<TAllResponse>;
        listQueryConfig?: IListQueryConfig<TResponse, TContract>;
    }): Promise<IGroupedKontentNetworkResponse<TAllResponse>> {
        const responses = await this.getListAllResponseInternalAsync({
            resolvedResponses: [],
            getResponse: data.getResponse,
            nextPageUrl: undefined,
            continuationToken: undefined,
            listQueryConfig: data.listQueryConfig
        });

        return data.allResponseFactory(
            responses.reduce((prev: any[], current) => {
                prev.push(...current.data.items);
                return prev;
            }, []),
            responses
        );
    }

    private async getListAllResponseInternalAsync<TResponse extends IKontentListResponse, TContract>(data: {
        nextPageUrl?: string;
        continuationToken?: string;
        getResponse: (nextPageUrl?: string, continuationToken?: string) => Promise<IKontentNetworkResponse<TResponse, TContract>>;
        resolvedResponses: IKontentNetworkResponse<TResponse, TContract>[];
        listQueryConfig?: IListQueryConfig<TResponse, TContract>;
    }): Promise<IKontentNetworkResponse<TResponse, TContract>[]> {
        const response = await data.getResponse(data.nextPageUrl, data.continuationToken);

        if (data.listQueryConfig?.delayBetweenRequests) {
            await this.sleep(data.listQueryConfig.delayBetweenRequests);
        }

        data.resolvedResponses.push(response);

        if (data.listQueryConfig?.responseFetched) {
            data.listQueryConfig.responseFetched(response, data.nextPageUrl, data.continuationToken);
        }

        if (response.data.pagination?.nextPage || response.xContinuationToken) {
            // recursively fetch next page data
            return await this.getListAllResponseInternalAsync({
                nextPageUrl: response.data.pagination?.nextPage,
                continuationToken: response.xContinuationToken,
                listQueryConfig: data.listQueryConfig,
                getResponse: data.getResponse,
                resolvedResponses: data.resolvedResponses
            });
        }

        return data.resolvedResponses;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
