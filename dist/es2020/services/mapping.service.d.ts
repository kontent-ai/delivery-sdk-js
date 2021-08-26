import { IBaseResponse } from '@kentico/kontent-core';
import { IDeliveryClientConfig } from '../config';
import { ElementContracts, ItemContracts, LanguageContracts, TaxonomyContracts, TypeContracts } from '../data-contracts';
import { ElementResponses, IContentItem, IItemQueryConfig, ItemResponses, LanguageResponses, TaxonomyResponses, TypeResponses } from '../models';
import { IRichTextHtmlParser } from '../parser';
export interface IMappingService {
    listContentTypesResponse(response: IBaseResponse<TypeContracts.IListContentTypeContract>): TypeResponses.ListContentTypesResponse;
    itemsFeedResponse<TItem extends IContentItem>(response: IBaseResponse<ItemContracts.IItemsFeedContract>, queryConfig: IItemQueryConfig): ItemResponses.ItemsFeedResponse<TItem>;
    itemsFeedAllResponse<TItem extends IContentItem>(responses: IBaseResponse<ItemContracts.IItemsFeedContract>[], queryConfig: IItemQueryConfig): ItemResponses.ItemsFeedAllResponse<TItem>;
    viewContentTypeResponse(response: IBaseResponse<TypeContracts.IViewContentTypeContract>): TypeResponses.ViewContentTypeResponse;
    viewContentItemResponse<TItem extends IContentItem = IContentItem>(response: IBaseResponse<ItemContracts.IViewContentItemContract>, queryConfig: IItemQueryConfig): ItemResponses.ViewContentItemResponse<TItem>;
    listContentItemsResponse<TItem extends IContentItem = IContentItem>(response: IBaseResponse<ItemContracts.IListContentItemsContract>, queryConfig: IItemQueryConfig): ItemResponses.ListContentItemsResponse<TItem>;
    viewTaxonomyGroupResponse(response: IBaseResponse<TaxonomyContracts.IViewTaxonomyGroupContract>): TaxonomyResponses.ViewTaxonomyGroupResponse;
    listTaxonomyGroupsResponse(response: IBaseResponse<TaxonomyContracts.IListTaxonomyGroupsContract>): TaxonomyResponses.ListTaxonomyGroupsResponse;
    viewContentTypeElementResponse(response: IBaseResponse<ElementContracts.IViewContentTypeElementContract>): ElementResponses.ViewContentTypeElementResponse;
    listLanguagesResponse(response: IBaseResponse<LanguageContracts.IListLanguagesContract>): LanguageResponses.ListLanguagesResponse;
}
export declare class MappingService implements IMappingService {
    readonly config: IDeliveryClientConfig;
    readonly richTextHtmlParser: IRichTextHtmlParser;
    private readonly typeMapper;
    private readonly languageMapper;
    private readonly itemMapper;
    private readonly taxonomyMapper;
    private readonly genericElementMapper;
    private readonly isDeveloperMode;
    constructor(config: IDeliveryClientConfig, richTextHtmlParser: IRichTextHtmlParser);
    /**
     * Gets response for list of languages
     * @param response Response data
     */
    listLanguagesResponse(response: IBaseResponse<LanguageContracts.IListLanguagesContract>): LanguageResponses.ListLanguagesResponse;
    /**
     * Gets response for getting a multiple type
     * @param response Response data
     */
    listContentTypesResponse(response: IBaseResponse<TypeContracts.IListContentTypeContract>): TypeResponses.ListContentTypesResponse;
    /**
     * Gets response for single type
     * @param response Response data
     * @param options Options
     */
    viewContentTypeResponse(response: IBaseResponse<TypeContracts.IViewContentTypeContract>): TypeResponses.ViewContentTypeResponse;
    itemsFeedResponse<TItem extends IContentItem>(response: IBaseResponse<ItemContracts.IItemsFeedContract>, queryConfig: IItemQueryConfig): ItemResponses.ItemsFeedResponse<TItem>;
    itemsFeedAllResponse<TItem extends IContentItem>(responses: IBaseResponse<ItemContracts.IItemsFeedContract>[], queryConfig: IItemQueryConfig): ItemResponses.ItemsFeedAllResponse<TItem>;
    /**
     * Gets response for getting single item
     * @param response Response data
     * @param queryConfig Query configuration
     */
    viewContentItemResponse<TItem extends IContentItem = IContentItem>(response: IBaseResponse<ItemContracts.IViewContentItemContract>, queryConfig: IItemQueryConfig): ItemResponses.ViewContentItemResponse<TItem>;
    /**
     * Gets response for getting multiple items
     * @param response Response data
     * @param queryConfig Query configuration
     */
    listContentItemsResponse<TItem extends IContentItem = IContentItem>(response: IBaseResponse<ItemContracts.IListContentItemsContract>, queryConfig: IItemQueryConfig): ItemResponses.ListContentItemsResponse<TItem>;
    /**
     * Gets response for getting single taxonomy item
     * @param response Response data
     */
    viewTaxonomyGroupResponse(response: IBaseResponse<TaxonomyContracts.IViewTaxonomyGroupContract>): TaxonomyResponses.ViewTaxonomyGroupResponse;
    /**
     * Gets response for getting multiples taxonomies
     * @param response Response data
     */
    listTaxonomyGroupsResponse(response: IBaseResponse<TaxonomyContracts.IListTaxonomyGroupsContract>): TaxonomyResponses.ListTaxonomyGroupsResponse;
    /**
     * Gets response for getting single content type element
     * @param response Response data
     */
    viewContentTypeElementResponse(response: IBaseResponse<ElementContracts.IViewContentTypeElementContract>): ElementResponses.ViewContentTypeElementResponse;
}
