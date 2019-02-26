import { IBaseResponse } from 'kentico-cloud-core';

import { IDeliveryClientConfig } from '../config';
import { ElementContracts, ItemContracts, TaxonomyContracts, TypeContracts } from '../data-contracts';
import { ICloudResponseDebug, IItemQueryConfig } from '../interfaces';
import { ContentItem, ElementResponses, ItemResponses, Pagination, TaxonomyResponses, TypeResponses } from '../models';
import { IRichTextHtmlParser } from '../parser';
import { ElementMapper } from './element.mapper';
import { ItemMapper } from './item.mapper';
import { TaxonomyMapper } from './taxonomy.mapper';
import { TypeMapper } from './type.mapper';

export class ResponseMapper {
  private readonly typeMapper: TypeMapper;
  private readonly itemMapper: ItemMapper;
  private readonly taxonomyMapper: TaxonomyMapper;
  private readonly elementMapper: ElementMapper;

  constructor(
    readonly config: IDeliveryClientConfig,
    readonly richTextHtmlParser: IRichTextHtmlParser
  ) {
    this.typeMapper = new TypeMapper();
    this.itemMapper = new ItemMapper(config, richTextHtmlParser);
    this.taxonomyMapper = new TaxonomyMapper();
    this.elementMapper = new ElementMapper();
  }

  /**
   * Gets response for getting a single type
   * @param response Response data
   */
  mapSingleTypeResponse(
    response: IBaseResponse<TypeContracts.ITypeResponseContract>
  ): TypeResponses.DeliveryTypeResponse {

    // map type
    const type = this.typeMapper.mapSingleType(response.data);

    return new TypeResponses.DeliveryTypeResponse(
      type,
      this.mapResponseDebug(response)
    );
  }

  /**
   * Gets resposne for getting multiple types
   * @param response Response data
   * @param options Options
   */
  mapMultipleTypeResponse(
    response: IBaseResponse<TypeContracts.ITypesResponseContract>
  ): TypeResponses.DeliveryTypeListingResponse {

    // map types
    const types = this.typeMapper.mapMultipleTypes(response.data);

    // pagination
    const pagination: Pagination = new Pagination({
      skip: response.data.pagination.skip,
      count: response.data.pagination.count,
      limit: response.data.pagination.limit,
      nextPage: response.data.pagination.next_page
    });

    return new TypeResponses.DeliveryTypeListingResponse(
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
  mapSingleResponse<TItem extends ContentItem>(
    response: IBaseResponse<ItemContracts.IItemResponseContract>,
    queryConfig: IItemQueryConfig
  ): ItemResponses.DeliveryItemResponse<TItem> {

    // map item
    const itemResult = this.itemMapper.mapSingleItem<TItem>(
      response.data,
      queryConfig
    );

    return new ItemResponses.DeliveryItemResponse(
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
  mapMultipleResponse<TItem extends ContentItem>(
    response: IBaseResponse<ItemContracts.IItemsResponseContract>,
    queryConfig: IItemQueryConfig
  ): ItemResponses.DeliveryItemListingResponse<TItem> {

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

    return new ItemResponses.DeliveryItemListingResponse(
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
  mapTaxonomyResponse(
    response: IBaseResponse<TaxonomyContracts.ITaxonomyResponseContract>
  ): TaxonomyResponses.TaxonomyResponse {

    // map taxonomy
    const taxonomy = this.taxonomyMapper.mapTaxonomy(
      response.data.system,
      response.data.terms
    );

    return new TaxonomyResponses.TaxonomyResponse(
      taxonomy,
      this.mapResponseDebug(response)
    );
  }

  /**
   * Gets response for getting multiples taxonomies
   * @param response Response data
   */
  mapTaxonomiesResponse(
    response: IBaseResponse<TaxonomyContracts.ITaxonomiesResponseContract>
  ): TaxonomyResponses.TaxonomiesResponse {

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

    return new TaxonomyResponses.TaxonomiesResponse(
      taxonomies,
      pagination,
      this.mapResponseDebug(response)
    );
  }

  /**
   * Gets response for getting single content type element
   * @param response Response data
   */
  mapElementResponse(
    response: IBaseResponse<ElementContracts.IElementResponseContract>
  ): ElementResponses.ElementResponse {

    // map element
    const element = this.elementMapper.mapElement(response.data);

    return new ElementResponses.ElementResponse(
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
