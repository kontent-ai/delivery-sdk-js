import { IHttpService } from '@kentico/kontent-core';
import { Observable } from 'rxjs';
import { IDeliveryClientConfig } from '../config';
import { ContentItem, ElementResponses, IContentTypeQueryConfig, IItemQueryConfig, ILanguagesQueryConfig, ITaxonomyQueryConfig, ItemResponses, LanguageResponses, TaxonomyResponses, TypeResponses } from '../models';
import { ISDKInfo } from '../models/common/common-models';
import { BaseDeliveryQueryService } from './base-delivery-query.service';
import { IMappingService } from './mapping.service';
export declare class QueryService extends BaseDeliveryQueryService {
    private readonly ContinuationHeaderName;
    constructor(config: IDeliveryClientConfig, httpService: IHttpService, sdkInfo: ISDKInfo, mappingService: IMappingService);
    /**
     * Gets single item from given url
     * @param url Url used to get single item
     * @param queryConfig Query configuration
     */
    getSingleItem<TItem extends ContentItem>(url: string, queryConfig: IItemQueryConfig): Observable<ItemResponses.ViewContentItemResponse<TItem>>;
    /**
     * Gets single feed response. Might not contain all items in your project.
     * @param url Url
     * @param queryConfig Query configuration
     */
    getItemsFeed<TItem extends ContentItem>(url: string, queryConfig: IItemQueryConfig): Observable<ItemResponses.ItemsFeedResponse<TItem>>;
    /**
     * Gets all items from feed. This method may execute multiple HTTP requests.
     * @param url Url
     * @param queryConfig Query configuration
     */
    getItemsFeedAll<TItem extends ContentItem>(url: string, queryConfig: IItemQueryConfig): Observable<ItemResponses.ItemsFeedAllResponse<TItem>>;
    /**
     * Gets multiple items from given url
     * @param url Url used to get multiple items
     * @param queryConfig Query configuration
     */
    getMultipleItems<TItem extends ContentItem>(url: string, queryConfig: IItemQueryConfig): Observable<ItemResponses.ListContentItemsResponse<TItem>>;
    /**
     * Gets single content type from given url
     * @param url Url used to get single type
     * @param queryConfig Query configuration
     */
    getSingleType(url: string, queryConfig: IContentTypeQueryConfig): Observable<TypeResponses.ViewContentTypeResponse>;
    /**
     * Gets multiple content types from given url
     * @param url Url used to get multiple types
     * @param queryConfig Query configuration
     */
    getMultipleTypes(url: string, queryConfig: IContentTypeQueryConfig): Observable<TypeResponses.ListContentTypesResponse>;
    /**
     * Gets languages
     * @param url Url
     * @param queryConfig Query configuration
     */
    getLanguages(url: string, queryConfig: ILanguagesQueryConfig): Observable<LanguageResponses.ListLanguagesResponse>;
    /**
     * Gets single taxonomy from given url
     * @param url Url used to get single taxonomy
     * @param queryConfig Query configuration
     */
    getTaxonomy(url: string, queryConfig: ITaxonomyQueryConfig): Observable<TaxonomyResponses.ViewTaxonomyGroupResponse>;
    /**
     * Gets multiple taxonomies from given url
     * @param url Url used to get multiple taxonomies
     * @param queryConfig Query configuration
     */
    getTaxonomies(url: string, queryConfig: ITaxonomyQueryConfig): Observable<TaxonomyResponses.ListTaxonomyGroupsResponse>;
    /**
     * Gets single content type element from given url
     * @param url Url used to get single content type element
     * @param queryConfig Query configuration
     */
    getElement(url: string, queryConfig: ITaxonomyQueryConfig): Observable<ElementResponses.ViewContentTypeElementResponse>;
    private getAllItemsFeedResponses;
}
