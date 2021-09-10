import { IResponse } from '@kentico/kontent-core';

import { IDeliveryClientConfig } from '../config';
import {
    ElementContracts,
    ItemContracts,
    LanguageContracts,
    TaxonomyContracts,
    TypeContracts
} from '../data-contracts';
import { GenericElementMapper, ItemMapper, LanguageMapper, TaxonomyMapper, TypeMapper } from '../mappers';
import {
    ElementResponses,
    IContentItem,
    IItemQueryConfig,
    ItemResponses,
    LanguageResponses,
    Pagination,
    TaxonomyResponses,
    TypeResponses
} from '../models';
import { IRichTextHtmlParser } from '../parser';

export interface IMappingService {
    listContentTypesResponse(
        response: IResponse<TypeContracts.IListContentTypeContract>
    ): TypeResponses.ListContentTypesResponse;

    itemsFeedResponse<TItem extends IContentItem>(
        response: IResponse<ItemContracts.IItemsFeedContract>,
        queryConfig: IItemQueryConfig
    ): ItemResponses.ListItemsFeedResponse<TItem>;

    viewContentTypeResponse(
        response: IResponse<TypeContracts.IViewContentTypeContract>
    ): TypeResponses.ViewContentTypeResponse;

    viewContentItemResponse<TItem extends IContentItem = IContentItem>(
        response: IResponse<ItemContracts.IViewContentItemContract>,
        queryConfig: IItemQueryConfig
    ): ItemResponses.ViewContentItemResponse<TItem>;

    listContentItemsResponse<TItem extends IContentItem = IContentItem>(
        response: IResponse<ItemContracts.IListContentItemsContract>,
        queryConfig: IItemQueryConfig
    ): ItemResponses.ListContentItemsResponse<TItem>;

    viewTaxonomyGroupResponse(
        response: IResponse<TaxonomyContracts.IViewTaxonomyGroupContract>
    ): TaxonomyResponses.ViewTaxonomyResponse;

    listTaxonomyGroupsResponse(
        response: IResponse<TaxonomyContracts.IListTaxonomyGroupsContract>
    ): TaxonomyResponses.ListTaxonomiesResponse;

    viewContentTypeElementResponse(
        response: IResponse<ElementContracts.IViewContentTypeElementContract>
    ): ElementResponses.ViewContentTypeElementResponse;

    listLanguagesResponse(
        response: IResponse<LanguageContracts.IListLanguagesContract>
    ): LanguageResponses.ListLanguagesResponse;
}

export class MappingService implements IMappingService {
    private readonly typeMapper: TypeMapper;
    private readonly languageMapper: LanguageMapper;
    private readonly itemMapper: ItemMapper;
    private readonly taxonomyMapper: TaxonomyMapper;
    private readonly genericElementMapper: GenericElementMapper;

    constructor(readonly config: IDeliveryClientConfig, readonly richTextHtmlParser: IRichTextHtmlParser) {
        this.typeMapper = new TypeMapper();
        this.languageMapper = new LanguageMapper();
        this.itemMapper = new ItemMapper(config, richTextHtmlParser);
        this.taxonomyMapper = new TaxonomyMapper();
        this.genericElementMapper = new GenericElementMapper();
    }

    /**
     * Gets response for list of languages
     * @param response Response data
     */
    listLanguagesResponse(
        response: IResponse<LanguageContracts.IListLanguagesContract>
    ): LanguageResponses.ListLanguagesResponse {
        const languages = this.languageMapper.mapMultipleLanguages(response.data);

        const pagination: Pagination = new Pagination({
            skip: response.data.pagination.skip,
            count: response.data.pagination.count,
            limit: response.data.pagination.limit,
            nextPage: response.data.pagination.next_page,
        });

        return new LanguageResponses.ListLanguagesResponse(languages, pagination, response);
    }

    /**
     * Gets response for getting a multiple type
     * @param response Response data
     */
    listContentTypesResponse(
        response: IResponse<TypeContracts.IListContentTypeContract>
    ): TypeResponses.ListContentTypesResponse {
        const types = this.typeMapper.mapMultipleTypes(response.data);

        const pagination: Pagination = new Pagination({
            skip: response.data.pagination.skip,
            count: response.data.pagination.count,
            limit: response.data.pagination.limit,
            nextPage: response.data.pagination.next_page
        });

        return new TypeResponses.ListContentTypesResponse(types, pagination, response);
    }

    /**
     * Gets response for single type
     * @param response Response data
     * @param options Options
     */
    viewContentTypeResponse(
        response: IResponse<TypeContracts.IViewContentTypeContract>
    ): TypeResponses.ViewContentTypeResponse {
        const type = this.typeMapper.mapSingleType(response.data);

        return new TypeResponses.ViewContentTypeResponse(type, response);
    }

    itemsFeedResponse<TItem extends IContentItem>(
        response: IResponse<ItemContracts.IItemsFeedContract>,
        queryConfig: IItemQueryConfig
    ): ItemResponses.ListItemsFeedResponse<TItem> {
        const itemsResult = this.itemMapper.mapItems<TItem>({
            linkedItems: Object.values(response.data.modular_content),
            mainItems: response.data.items,
            queryConfig: queryConfig
        });

        return new ItemResponses.ListItemsFeedResponse(
            itemsResult.items,
            itemsResult.linkedItems,
            response
        );
    }

    /**
     * Gets response for getting single item
     * @param response Response data
     * @param queryConfig Query configuration
     */
    viewContentItemResponse<TItem extends IContentItem = IContentItem>(
        response: IResponse<ItemContracts.IViewContentItemContract>,
        queryConfig: IItemQueryConfig
    ): ItemResponses.ViewContentItemResponse<TItem> {
        const itemResult = this.itemMapper.mapSingleItemFromResponse<TItem>(response.data, queryConfig);

        return new ItemResponses.ViewContentItemResponse<TItem>(
            itemResult.item,
            itemResult.linkedItems,
            response
        );
    }

    /**
     * Gets response for getting multiple items
     * @param response Response data
     * @param queryConfig Query configuration
     */
    listContentItemsResponse<TItem extends IContentItem = IContentItem>(
        response: IResponse<ItemContracts.IListContentItemsContract>,
        queryConfig: IItemQueryConfig
    ): ItemResponses.ListContentItemsResponse<TItem> {
        const itemsResult = this.itemMapper.mapMultipleItemsFromResponse<TItem>(response.data, queryConfig);
        const pagination: Pagination = new Pagination({
            skip: response.data.pagination.skip,
            count: response.data.pagination.count,
            limit: response.data.pagination.limit,
            nextPage: response.data.pagination.next_page,
            totalCount: response.data.pagination.total_count
        });

        return new ItemResponses.ListContentItemsResponse<TItem>(
            itemsResult.items,
            pagination,
            itemsResult.linkedItems,
            response
        );
    }

    /**
     * Gets response for getting single taxonomy item
     * @param response Response data
     */
    viewTaxonomyGroupResponse(
        response: IResponse<TaxonomyContracts.IViewTaxonomyGroupContract>
    ): TaxonomyResponses.ViewTaxonomyResponse {
        const taxonomy = this.taxonomyMapper.mapTaxonomy(response.data.system, response.data.terms);

        return new TaxonomyResponses.ViewTaxonomyResponse(taxonomy, response);
    }

    /**
     * Gets response for getting multiples taxonomies
     * @param response Response data
     */
    listTaxonomyGroupsResponse(
        response: IResponse<TaxonomyContracts.IListTaxonomyGroupsContract>
    ): TaxonomyResponses.ListTaxonomiesResponse {
        const taxonomies = this.taxonomyMapper.mapTaxonomies(response.data.taxonomies);

        const pagination: Pagination = new Pagination({
            skip: response.data.pagination.skip,
            count: response.data.pagination.count,
            limit: response.data.pagination.limit,
            nextPage: response.data.pagination.next_page
        });

        return new TaxonomyResponses.ListTaxonomiesResponse(taxonomies, pagination, response);
    }

    /**
     * Gets response for getting single content type element
     * @param response Response data
     */
    viewContentTypeElementResponse(
        response: IResponse<ElementContracts.IViewContentTypeElementContract>
    ): ElementResponses.ViewContentTypeElementResponse {
        const element = this.genericElementMapper.mapElement(response.data);

        return new ElementResponses.ViewContentTypeElementResponse(element, response);
    }
}
