import { IHttpService } from '@kontent-ai/core-sdk';

import { IDeliveryClientConfig } from '../config';
import { Contracts } from '../contracts';
import {
    Responses,
    IContentItem,
    IContentTypeQueryConfig,
    IGroupedNetworkResponse,
    IItemQueryConfig,
    IDeliveryNetworkResponse,
    ILanguagesQueryConfig,
    ITaxonomyQueryConfig,
    ISyncInitQueryConfig
} from '../models';
import {
    IKontentListAllResponse,
    IKontentListResponse,
    IListAllQueryConfig,
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
    ): Promise<
        IDeliveryNetworkResponse<Responses.IViewContentItemResponse<TContentItem>, Contracts.IViewContentItemContract>
    > {
        const response = await this.getResponseAsync<Contracts.IViewContentItemContract>(url, queryConfig);

        return this.mapNetworkResponse<
            Responses.IViewContentItemResponse<TContentItem>,
            Contracts.IViewContentItemContract
        >(this.mappingService.viewContentItemResponse<TContentItem>(response.data), response);
    }

    /**
     * Gets single feed response. Might not contain all items in your project.
     * @param url Url
     * @param queryConfig Query configuration
     */
    async getItemsFeed<TContentItem extends IContentItem = IContentItem>(
        url: string,
        queryConfig: IItemQueryConfig
    ): Promise<IDeliveryNetworkResponse<Responses.IListItemsFeedResponse<TContentItem>, Contracts.IItemsFeedContract>> {
        const response = await this.getResponseAsync<Contracts.IItemsFeedContract>(url, queryConfig);

        return this.mapNetworkResponse(this.mappingService.itemsFeedResponse<TContentItem>(response.data), response);
    }

    /**
     * Gets multiple items from given url
     * @param url Url used to get multiple items
     * @param queryConfig Query configuration
     */
    async getMultipleItems<TContentItem extends IContentItem = IContentItem>(
        url: string,
        queryConfig: IItemQueryConfig
    ): Promise<
        IDeliveryNetworkResponse<Responses.IListContentItemsResponse<TContentItem>, Contracts.IListContentItemsContract>
    > {
        const response = await this.getResponseAsync<Contracts.IListContentItemsContract>(url, queryConfig);

        return this.mapNetworkResponse(this.mappingService.listContentItemsResponse(response.data), response);
    }

    /**
     * Gets single content type from given url
     * @param url Url used to get single type
     * @param queryConfig Query configuration
     */
    async getSingleType(
        url: string,
        queryConfig: IContentTypeQueryConfig
    ): Promise<IDeliveryNetworkResponse<Responses.IViewContentTypeResponse, Contracts.IViewContentTypeContract>> {
        const response = await this.getResponseAsync<Contracts.IViewContentTypeContract>(url, queryConfig);

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
    ): Promise<IDeliveryNetworkResponse<Responses.IListContentTypesResponse, Contracts.IListContentTypeContract>> {
        const response = await this.getResponseAsync<Contracts.IListContentTypeContract>(url, queryConfig);

        return this.mapNetworkResponse(this.mappingService.listContentTypesResponse(response.data), response);
    }

    /**
     * Initializes synchronization of changes in content items based on the specified parameters. After the initialization,
     * you'll get an X-Continuation token in the response.
     * Use the token to synchronize changes in the content items matching the initialization criteria.
     * @param url Url
     * @param queryConfig Query configuration
     */
    async initializeSync(
        url: string,
        queryConfig: ISyncInitQueryConfig
    ): Promise<IDeliveryNetworkResponse<Responses.IInitializeSyncResponse, Contracts.IInitializeSyncContract>> {
        const response = await this.postResponseAsync<Contracts.IInitializeSyncContract>(url, {}, queryConfig);

        return this.mapNetworkResponse(this.mappingService.initializeContentSync(response.data), response);
    }

    /**
     * Retrieve a list of delta updates to recently changed content items in the specified project.
     * The types of items you get is determined by the X-Continuation token you use.
     * @param url Url used to get multiple types
     * @param queryConfig Query configuration
     */
    async syncChanges(
        url: string,
        queryConfig: IContentTypeQueryConfig
    ): Promise<IDeliveryNetworkResponse<Responses.ISyncChangesResponse, Contracts.ISyncChangesContract>> {
        const response = await this.getResponseAsync<Contracts.ISyncChangesContract>(url, queryConfig);

        return this.mapNetworkResponse(this.mappingService.syncChanges(response.data), response);
    }

    /**
     * Gets languages
     * @param url Url
     * @param queryConfig Query configuration
     */
    async getLanguages(
        url: string,
        queryConfig: ILanguagesQueryConfig
    ): Promise<IDeliveryNetworkResponse<Responses.IListLanguagesResponse, Contracts.IListLanguagesContract>> {
        const response = await this.getResponseAsync<Contracts.IListLanguagesContract>(url, queryConfig);

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
    ): Promise<IDeliveryNetworkResponse<Responses.IViewTaxonomyResponse, Contracts.IViewTaxonomyGroupContract>> {
        const response = await this.getResponseAsync<Contracts.IViewTaxonomyGroupContract>(url, queryConfig);

        return this.mapNetworkResponse(this.mappingService.viewTaxonomyResponse(response.data), response);
    }

    /**
     * Gets multiple taxonomies from given url
     * @param url Url used to get multiple taxonomies
     * @param queryConfig Query configuration
     */
    async getTaxonomies(
        url: string,
        queryConfig: ITaxonomyQueryConfig
    ): Promise<IDeliveryNetworkResponse<Responses.IListTaxonomiesResponse, Contracts.IListTaxonomyGroupsContract>> {
        const response = await this.getResponseAsync<Contracts.IListTaxonomyGroupsContract>(url, queryConfig);

        return this.mapNetworkResponse(this.mappingService.listTaxonomiesResponse(response.data), response);
    }

    /**
     * Gets single content type element from given url
     * @param url Url used to get single content type element
     * @param queryConfig Query configuration
     */
    async getElementAsync(
        url: string,
        queryConfig: ITaxonomyQueryConfig
    ): Promise<
        IDeliveryNetworkResponse<Responses.IViewContentTypeElementResponse, Contracts.IViewContentTypeElementContract>
    > {
        const response = await this.getResponseAsync<Contracts.IViewContentTypeElementContract>(url, queryConfig);

        return this.mapNetworkResponse(this.mappingService.viewContentTypeElementResponse(response.data), response);
    }

    async getListAllResponse<
        TResponse extends IKontentListResponse,
        TAllResponse extends IKontentListAllResponse,
        TContract
    >(data: {
        page: number;
        getResponse: (
            nextPageUrl?: string,
            continuationToken?: string
        ) => Promise<IDeliveryNetworkResponse<TResponse, TContract>>;
        allResponseFactory: (
            items: any[],
            responses: IDeliveryNetworkResponse<TResponse, TContract>[]
        ) => IGroupedNetworkResponse<TAllResponse>;
        listQueryConfig?: IListAllQueryConfig<TResponse, TContract>;
    }): Promise<IGroupedNetworkResponse<TAllResponse>> {
        const responses = await this.getListAllResponseInternalAsync({
            page: data.page,
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
        page: number;
        nextPageUrl?: string;
        continuationToken?: string;
        getResponse: (
            nextPageUrl?: string,
            continuationToken?: string
        ) => Promise<IDeliveryNetworkResponse<TResponse, TContract>>;
        resolvedResponses: IDeliveryNetworkResponse<TResponse, TContract>[];
        listQueryConfig?: IListAllQueryConfig<TResponse, TContract>;
    }): Promise<IDeliveryNetworkResponse<TResponse, TContract>[]> {
        if (data.listQueryConfig?.pages) {
            if (data.page > data.listQueryConfig.pages) {
                // page limit reached, return result
                return data.resolvedResponses;
            }
        }

        const response = await data.getResponse(data.nextPageUrl, data.continuationToken);

        if (data.listQueryConfig?.delayBetweenRequests) {
            await this.sleep(data.listQueryConfig.delayBetweenRequests);
        }

        data.resolvedResponses.push(response);

        if (data.listQueryConfig?.responseFetched) {
            data.listQueryConfig.responseFetched(response, data.nextPageUrl, data.continuationToken);
        }

        const nextPage = response.data.pagination?.nextPage;
        const continuationToken = response.xContinuationToken;

        if (nextPage || continuationToken) {
            // recursively fetch next page data
            return await this.getListAllResponseInternalAsync({
                page: data.page + 1,
                nextPageUrl: nextPage,
                continuationToken: continuationToken,
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
