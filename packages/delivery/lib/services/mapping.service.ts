import { IBaseResponse } from 'kentico-cloud-core';

import { IDeliveryClientConfig } from '../config';
import { ElementContracts, ItemContracts, TaxonomyContracts, TypeContracts } from '../data-contracts';
import { GenericElementMapper, ItemMapper, TaxonomyMapper, TypeMapper } from '../mappers';
import {
    ElementResponses,
    ICloudResponseDebug,
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
        response: IBaseResponse<TypeContracts.IListContentTypesContract>
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

    mapResponseDebug(response: IBaseResponse<any>): ICloudResponseDebug;
}

export class MappingService implements IMappingService {
    private readonly typeMapper: TypeMapper;
    private readonly itemMapper: ItemMapper;
    private readonly taxonomyMapper: TaxonomyMapper;
    private readonly genericElementMapper: GenericElementMapper;

    constructor(
        readonly config: IDeliveryClientConfig,
        readonly richTextHtmlParser: IRichTextHtmlParser
    ) {
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
        response: IBaseResponse<TypeContracts.IListContentTypesContract>
    ): TypeResponses.ListContentTypesResponse {

        // map type
        const type = this.typeMapper.mapSingleType(response.data);

        return new TypeResponses.ListContentTypesResponse(
            type,
            this.mapResponseDebug(response)
        );
    }

    /**
     * Gets resposne for getting multiple types
     * @param response Response data
     * @param options Options
     */
    viewContentTypeResponse(
        response: IBaseResponse<TypeContracts.IViewContentTypeContract>
    ): TypeResponses.ViewContentTypeResponse {

        // map types
        const types = this.typeMapper.mapMultipleTypes(response.data);

        // pagination
        const pagination: Pagination = new Pagination({
            skip: response.data.pagination.skip,
            count: response.data.pagination.count,
            limit: response.data.pagination.limit,
            nextPage: response.data.pagination.next_page
        });

        return new TypeResponses.ViewContentTypeResponse(
            types,
            pagination,
            this.mapResponseDebug(response)
        );
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
        const itemResult = this.itemMapper.mapSingleItem<TItem>(
            response.data,
            queryConfig
        );

        return new ItemResponses.ViewContentItemResponse<TItem>(
            itemResult.item,
            itemResult.processedItems,
            this.mapResponseDebug(response)
        );
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
        const itemsResult = this.itemMapper.mapMultipleItems<TItem>(
            response.data,
            queryConfig
        );

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
            this.mapResponseDebug(response)
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
        const taxonomy = this.taxonomyMapper.mapTaxonomy(
            response.data.system,
            response.data.terms
        );

        return new TaxonomyResponses.ViewTaxonomyGroupResponse(
            taxonomy,
            this.mapResponseDebug(response)
        );
    }

    /**
     * Gets response for getting multiples taxonomies
     * @param response Response data
     */
    listTaxonomyGroupsResponse(
        response: IBaseResponse<TaxonomyContracts.IListTaxonomyGroupsContract>
    ): TaxonomyResponses.ListTaxonomyGroupsResponse {

        // map taxonomies
        const taxonomies = this.taxonomyMapper.mapTaxonomies(
            response.data.taxonomies
        );

        // pagination
        const pagination: Pagination = new Pagination({
            skip: response.data.pagination.skip,
            count: response.data.pagination.count,
            limit: response.data.pagination.limit,
            nextPage: response.data.pagination.next_page
        });

        return new TaxonomyResponses.ListTaxonomyGroupsResponse(
            taxonomies,
            pagination,
            this.mapResponseDebug(response)
        );
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

        return new ElementResponses.ViewContentTypeElementResponse(
            element,
            this.mapResponseDebug(response)
        );
    }

    mapResponseDebug(response: IBaseResponse<any>): ICloudResponseDebug {
        if (!response) {
            throw Error(`Cannot map 'debug' model from the response`);
        }

        return {
            response: response.response
        };
    }
}
