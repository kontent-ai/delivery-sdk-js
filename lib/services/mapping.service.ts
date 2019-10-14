import { IBaseResponse } from '@kentico/kontent-core';

import { IDeliveryClientConfig } from '../config';
import { ElementContracts, ItemContracts, TaxonomyContracts, TypeContracts } from '../data-contracts';
import { GenericElementMapper, ItemMapper, TaxonomyMapper, TypeMapper } from '../mappers';
import {
    ElementResponses,
    IContentItem,
    IItemQueryConfig,
    ItemResponses,
    Pagination,
    TaxonomyResponses,
    TypeResponses,
} from '../models';
import { IRichTextHtmlParser } from '../parser';

export interface IMappingService {
    listContentTypesResponse(
        response: IBaseResponse<TypeContracts.IListContentTypeContract>
    ): TypeResponses.ListContentTypesResponse;

    viewContentTypeResponse(
        response: IBaseResponse<TypeContracts.IViewContentTypeContract>
    ): TypeResponses.ViewContentTypeResponse;

    viewContentItemResponse<TItem extends IContentItem = IContentItem>(
        response: IBaseResponse<ItemContracts.IViewContentItemContract>,
        queryConfig: IItemQueryConfig
    ): ItemResponses.ViewContentItemResponse<TItem>;

    listContentItemsResponse<TItem extends IContentItem = IContentItem>(
        response: IBaseResponse<ItemContracts.IListContentItemsContract>,
        queryConfig: IItemQueryConfig
    ): ItemResponses.ListContentItemsResponse<TItem>;

    viewTaxonomyGroupResponse(
        response: IBaseResponse<TaxonomyContracts.IViewTaxonomyGroupContract>
    ): TaxonomyResponses.ViewTaxonomyGroupResponse;

    listTaxonomyGroupsResponse(
        response: IBaseResponse<TaxonomyContracts.IListTaxonomyGroupsContract>
    ): TaxonomyResponses.ListTaxonomyGroupsResponse;

    viewContentTypeElementResponse(
        response: IBaseResponse<ElementContracts.IViewContentTypeElementContract>
    ): ElementResponses.ViewContentTypeElementResponse;
}

export class MappingService implements IMappingService {
    private readonly typeMapper: TypeMapper;
    private readonly itemMapper: ItemMapper;
    private readonly taxonomyMapper: TaxonomyMapper;
    private readonly genericElementMapper: GenericElementMapper;

    constructor(readonly config: IDeliveryClientConfig, readonly richTextHtmlParser: IRichTextHtmlParser) {
        this.typeMapper = new TypeMapper();
        this.itemMapper = new ItemMapper(config, richTextHtmlParser);
        this.taxonomyMapper = new TaxonomyMapper();
        this.genericElementMapper = new GenericElementMapper();
    }

    /**
     * Gets response for getting a single type
     * @param response Response data
     */
    listContentTypesResponse(
        response: IBaseResponse<TypeContracts.IListContentTypeContract>
    ): TypeResponses.ListContentTypesResponse {
        // map types
        const types = this.typeMapper.mapMultipleTypes(response.data);

        // pagination
        const pagination: Pagination = new Pagination({
            skip: response.data.pagination.skip,
            count: response.data.pagination.count,
            limit: response.data.pagination.limit,
            nextPage: response.data.pagination.next_page
        });

        return new TypeResponses.ListContentTypesResponse(types, pagination, response);
    }

    /**
     * Gets resposne for getting multiple types
     * @param response Response data
     * @param options Options
     */
    viewContentTypeResponse(
        response: IBaseResponse<TypeContracts.IViewContentTypeContract>
    ): TypeResponses.ViewContentTypeResponse {
        // map type
        const type = this.typeMapper.mapSingleType(response.data);

        return new TypeResponses.ViewContentTypeResponse(type, response);
    }

    /**
     * Gets response for getting single item
     * @param response Response data
     * @param queryConfig Query configuration
     */
    viewContentItemResponse<TItem extends IContentItem = IContentItem>(
        response: IBaseResponse<ItemContracts.IViewContentItemContract>,
        queryConfig: IItemQueryConfig
    ): ItemResponses.ViewContentItemResponse<TItem> {
        // map item
        const itemResult = this.itemMapper.mapSingleItem<TItem>(response.data, queryConfig);

        return new ItemResponses.ViewContentItemResponse<TItem>(itemResult.item, itemResult.processedItems, response);
    }

    /**
     * Gets response for getting multiple items
     * @param response Response data
     * @param queryConfig Query configuration
     */
    listContentItemsResponse<TItem extends IContentItem = IContentItem>(
        response: IBaseResponse<ItemContracts.IListContentItemsContract>,
        queryConfig: IItemQueryConfig
    ): ItemResponses.ListContentItemsResponse<TItem> {
        // map items
        const itemsResult = this.itemMapper.mapMultipleItems<TItem>(response.data, queryConfig);

        // pagination
        const pagination: Pagination = new Pagination({
            skip: response.data.pagination.skip,
            count: response.data.pagination.count,
            limit: response.data.pagination.limit,
            nextPage: response.data.pagination.next_page
        });

        return new ItemResponses.ListContentItemsResponse<TItem>(
            itemsResult.items,
            pagination,
            itemsResult.processedItems,
            response
        );
    }

    /**
     * Gets response for getting single taxonomy item
     * @param response Response data
     */
    viewTaxonomyGroupResponse(
        response: IBaseResponse<TaxonomyContracts.IViewTaxonomyGroupContract>
    ): TaxonomyResponses.ViewTaxonomyGroupResponse {
        // map taxonomy
        const taxonomy = this.taxonomyMapper.mapTaxonomy(response.data.system, response.data.terms);

        return new TaxonomyResponses.ViewTaxonomyGroupResponse(taxonomy, response);
    }

    /**
     * Gets response for getting multiples taxonomies
     * @param response Response data
     */
    listTaxonomyGroupsResponse(
        response: IBaseResponse<TaxonomyContracts.IListTaxonomyGroupsContract>
    ): TaxonomyResponses.ListTaxonomyGroupsResponse {
        // map taxonomies
        const taxonomies = this.taxonomyMapper.mapTaxonomies(response.data.taxonomies);

        // pagination
        const pagination: Pagination = new Pagination({
            skip: response.data.pagination.skip,
            count: response.data.pagination.count,
            limit: response.data.pagination.limit,
            nextPage: response.data.pagination.next_page
        });

        return new TaxonomyResponses.ListTaxonomyGroupsResponse(taxonomies, pagination, response);
    }

    /**
     * Gets response for getting single content type element
     * @param response Response data
     */
    viewContentTypeElementResponse(
        response: IBaseResponse<ElementContracts.IViewContentTypeElementContract>
    ): ElementResponses.ViewContentTypeElementResponse {
        // map element
        const element = this.genericElementMapper.mapElement(response.data);

        return new ElementResponses.ViewContentTypeElementResponse(element, response);
    }
}
