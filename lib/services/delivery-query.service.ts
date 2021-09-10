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
    ContentItem,
    ElementResponses,
    IContentTypeQueryConfig,
    IItemQueryConfig,
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
    async getSingleItemAsync<TItem extends ContentItem>(
        url: string,
        queryConfig: IItemQueryConfig
    ): Promise<ItemResponses.ViewContentItemResponse<TItem>> {
        return this.mappingService.viewContentItemResponse<TItem>(
            await this.getResponseAsync<ItemContracts.IViewContentItemContract>(url, queryConfig),
            queryConfig
        );
    }

    /**
     * Gets single feed response. Might not contain all items in your project.
     * @param url Url
     * @param queryConfig Query configuration
     */
    async getItemsFeed<TItem extends ContentItem>(
        url: string,
        queryConfig: IItemQueryConfig
    ): Promise<ItemResponses.ListItemsFeedResponse<TItem>> {
        return this.mappingService.itemsFeedResponse<TItem>(
            await this.getResponseAsync<ItemContracts.IItemsFeedContract>(url),
            queryConfig
        );
    }

    /**
     * Gets multiple items from given url
     * @param url Url used to get multiple items
     * @param queryConfig Query configuration
     */
    async getMultipleItems<TItem extends ContentItem>(
        url: string,
        queryConfig: IItemQueryConfig
    ): Promise<ItemResponses.ListContentItemsResponse<TItem>> {
        return this.mappingService.listContentItemsResponse(
            await this.getResponseAsync<ItemContracts.IListContentItemsContract>(url, queryConfig),
            queryConfig
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
    ): Promise<TypeResponses.ViewContentTypeResponse> {
        return this.mappingService.viewContentTypeResponse(
            await this.getResponseAsync<TypeContracts.IViewContentTypeContract>(url, queryConfig)
        );
    }

    /**
     * Gets multiple content types from given url
     * @param url Url used to get multiple types
     * @param queryConfig Query configuration
     */
    async getMultipleTypes(
        url: string,
        queryConfig: IContentTypeQueryConfig
    ): Promise<TypeResponses.ListContentTypesResponse> {
        return this.mappingService.listContentTypesResponse(
            await this.getResponseAsync<TypeContracts.IListContentTypeContract>(url, queryConfig)
        );
    }

    /**
     * Gets languages
     * @param url Url
     * @param queryConfig Query configuration
     */
    async getLanguages(
        url: string,
        queryConfig: ILanguagesQueryConfig
    ): Promise<LanguageResponses.ListLanguagesResponse> {
        return this.mappingService.listLanguagesResponse(
            await this.getResponseAsync<LanguageContracts.IListLanguagesContract>(url, queryConfig)
        );
    }

    /**
     * Gets single taxonomy from given url
     * @param url Url used to get single taxonomy
     * @param queryConfig Query configuration
     */
    async getTaxonomy(url: string, queryConfig: ITaxonomyQueryConfig): Promise<TaxonomyResponses.ViewTaxonomyResponse> {
        return this.mappingService.viewTaxonomyGroupResponse(
            await this.getResponseAsync<TaxonomyContracts.IViewTaxonomyGroupContract>(url, queryConfig)
        );
    }

    /**
     * Gets multiple taxonomies from given url
     * @param url Url used to get multiple taxonomies
     * @param queryConfig Query configuration
     */
    async getTaxonomies(
        url: string,
        queryConfig: ITaxonomyQueryConfig
    ): Promise<TaxonomyResponses.ListTaxonomiesResponse> {
        return this.mappingService.listTaxonomyGroupsResponse(
            await this.getResponseAsync<TaxonomyContracts.IListTaxonomyGroupsContract>(url, queryConfig)
        );
    }

    /**
     * Gets single content type element from given url
     * @param url Url used to get single content type element
     * @param queryConfig Query configuration
     */
    async getElementAsync(
        url: string,
        queryConfig: ITaxonomyQueryConfig
    ): Promise<ElementResponses.ViewContentTypeElementResponse> {
        return this.mappingService.viewContentTypeElementResponse(
            await this.getResponseAsync<ElementContracts.IViewContentTypeElementContract>(url, queryConfig)
        );
    }

    async getListAllResponse<
        TResponse extends IKontentListResponse,
        TAllResponse extends IKontentListAllResponse
    >(data: {
        getResponse: (nextPageUrl?: string, continuationToken?: string) => Promise<TResponse>;
        allResponseFactory: (items: any[], responses: TResponse[]) => TAllResponse;
        listQueryConfig?: IListQueryConfig<TResponse>;
    }): Promise<TAllResponse> {
        const responses = await this.getListAllResponseInternalAsync({
            resolvedResponses: [],
            getResponse: data.getResponse,
            nextPageUrl: undefined,
            continuationToken: undefined,
            listQueryConfig: data.listQueryConfig
        });

        return data.allResponseFactory(
            responses.reduce((prev: any[], current) => {
                prev.push(...current.items);
                return prev;
            }, []),
            responses
        );
    }

    private async getListAllResponseInternalAsync<TResponse extends IKontentListResponse>(data: {
        nextPageUrl?: string;
        continuationToken?: string;
        getResponse: (nextPageUrl?: string, continuationToken?: string) => Promise<TResponse>;
        resolvedResponses: TResponse[];
        listQueryConfig?: IListQueryConfig<TResponse>;
    }): Promise<TResponse[]> {
        const response = await data.getResponse(data.nextPageUrl, data.continuationToken);

        if (data.listQueryConfig?.delayBetweenRequests) {
            await this.sleep(data.listQueryConfig.delayBetweenRequests);
        }

        data.resolvedResponses.push(response);

        if (data.listQueryConfig?.responseFetched) {
            data.listQueryConfig.responseFetched(response, data.nextPageUrl, data.continuationToken);
        }

        if (response.pagination?.nextPage || response.continuationToken) {
            // recursively fetch next page data
            return await this.getListAllResponseInternalAsync({
                nextPageUrl: response.pagination?.nextPage,
                continuationToken: response.continuationToken,
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
