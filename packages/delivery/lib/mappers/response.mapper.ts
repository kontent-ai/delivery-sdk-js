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
    response: IBaseResponse
  ): TypeResponses.DeliveryTypeResponse {
    const cloudResponse = (response.data as any) as TypeContracts.ITypeResponseContract;

    // map type
    const type = this.typeMapper.mapSingleType(cloudResponse);

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
    response: IBaseResponse
  ): TypeResponses.DeliveryTypeListingResponse {
    const cloudResponse = (response.data as any) as TypeContracts.ITypesResponseContract;

    // map types
    const types = this.typeMapper.mapMultipleTypes(cloudResponse);

    // pagination
    const pagination: Pagination = new Pagination({
      skip: cloudResponse.pagination.skip,
      count: cloudResponse.pagination.count,
      limit: cloudResponse.pagination.limit,
      next_page: cloudResponse.pagination.next_page
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
    response: IBaseResponse,
    queryConfig: IItemQueryConfig
  ): ItemResponses.DeliveryItemResponse<TItem> {
    const cloudResponse = (response.data as any) as ItemContracts.IItemResponseContract;

    // map item
    const item = this.itemMapper.mapSingleItem<TItem>(
      cloudResponse,
      queryConfig
    );

    return new ItemResponses.DeliveryItemResponse(
      item,
      this.mapResponseDebug(response)
    );
  }

  /**
   * Gets response for getting multiple items
   * @param response Response data
   * @param queryConfig Query configuration
   */
  mapMultipleResponse<TItem extends ContentItem>(
    response: IBaseResponse,
    queryConfig: IItemQueryConfig
  ): ItemResponses.DeliveryItemListingResponse<TItem> {
    const cloudResponse = (response.data as any) as ItemContracts.IItemsResponseContract;

    // map items
    const items = this.itemMapper.mapMultipleItems<TItem>(
      cloudResponse,
      queryConfig
    );

    // pagination
    const pagination: Pagination = new Pagination({
      skip: cloudResponse.pagination.skip,
      count: cloudResponse.pagination.count,
      limit: cloudResponse.pagination.limit,
      next_page: cloudResponse.pagination.next_page
    });

    return new ItemResponses.DeliveryItemListingResponse(
      items,
      pagination,
      this.mapResponseDebug(response)
    );
  }

  /**
   * Gets response for getting single taxonomy item
   * @param response Response data
   */
  mapTaxonomyResponse(
    response: IBaseResponse
  ): TaxonomyResponses.TaxonomyResponse {
    const cloudResponse = (response.data as any) as TaxonomyContracts.ITaxonomyResponseContract;

    // map taxonomy
    const taxonomy = this.taxonomyMapper.mapTaxonomy(
      cloudResponse.system,
      cloudResponse.terms
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
    response: IBaseResponse
  ): TaxonomyResponses.TaxonomiesResponse {
    const cloudResponse = (response.data as any) as TaxonomyContracts.ITaxonomiesResponseContract;

    // map taxonomies
    const taxonomies = this.taxonomyMapper.mapTaxonomies(
      cloudResponse.taxonomies
    );

    // pagination
    const pagination: Pagination = new Pagination({
      skip: cloudResponse.pagination.skip,
      count: cloudResponse.pagination.count,
      limit: cloudResponse.pagination.limit,
      next_page: cloudResponse.pagination.next_page
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
    response: IBaseResponse
  ): ElementResponses.ElementResponse {
    const cloudResponse = (response.data as any) as ElementContracts.IElementResponseContract;

    // map element
    const element = this.elementMapper.mapElement(cloudResponse);

    return new ElementResponses.ElementResponse(
      element,
      this.mapResponseDebug(response)
    );
  }

  mapResponseDebug(response: IBaseResponse): ICloudResponseDebug {
    if (!response) {
      throw Error(`Cannot map 'debug' model from the response`);
    }

    return {
      response: response.response
    };
  }
}
