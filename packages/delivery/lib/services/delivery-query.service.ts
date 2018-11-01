import { IHttpService } from 'kentico-cloud-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IDeliveryClientConfig } from '../config';
import { ElementContracts, ItemContracts, TaxonomyContracts, TypeContracts } from '../data-contracts';
import { IContentTypeQueryConfig, IItemQueryConfig, ISDKInfo, ITaxonomyQueryConfig } from '../interfaces';
import { ContentItem, ElementResponses, ItemResponses, TaxonomyResponses, TypeResponses } from '../models';
import { IRichTextHtmlParser } from '../parser';
import { BaseDeliveryQueryService } from './base-delivery-query.service';

export class QueryService extends BaseDeliveryQueryService {

  constructor(
    config: IDeliveryClientConfig,
    httpService: IHttpService,
    richTextHtmlParser: IRichTextHtmlParser,
    sdkInfo: ISDKInfo
  ) {
    super(config, httpService, richTextHtmlParser, sdkInfo);
  }



  /**
   * Gets single item from given url
   * @param url Url used to get single item
   * @param queryConfig Query configuration
   */
  getSingleItem<TItem extends ContentItem>(
    url: string,
    queryConfig: IItemQueryConfig
  ): Observable<ItemResponses.DeliveryItemResponse<TItem>> {
    return this.getResponse<ItemContracts.IItemResponseContract>(url, queryConfig).pipe(
      map(response => {
        return this.responseMapper.mapSingleResponse<TItem>(
          response,
          queryConfig
        );
      })
    );
  }

  /**
   * Gets multiple items from given url
   * @param url Url used to get multiple items
   * @param queryConfig Query configuration
   */
  getMultipleItems<TItem extends ContentItem>(
    url: string,
    queryConfig: IItemQueryConfig
  ): Observable<ItemResponses.DeliveryItemListingResponse<TItem>> {
    return this.getResponse<ItemContracts.IItemsResponseContract>(url, queryConfig).pipe(
      map(response => {
        return this.responseMapper.mapMultipleResponse<TItem>(
          response,
          queryConfig
        );
      })
    );
  }

  /**
   * Gets single content type from given url
   * @param url Url used to get single type
   * @param queryConfig Query configuration
   */
  getSingleType(
    url: string,
    queryConfig: IContentTypeQueryConfig
  ): Observable<TypeResponses.DeliveryTypeResponse> {
    return this.getResponse<TypeContracts.ITypeResponseContract>(url, queryConfig).pipe(
      map(response => {
        return this.responseMapper.mapSingleTypeResponse(response);
      })
    );
  }

  /**
   * Gets multiple content types from given url
   * @param url Url used to get multiple types
   * @param queryConfig Query configuration
   */
  getMultipleTypes(
    url: string,
    queryConfig: IContentTypeQueryConfig
  ): Observable<TypeResponses.DeliveryTypeListingResponse> {
    return this.getResponse<TypeContracts.ITypesResponseContract>(url, queryConfig).pipe(
      map(response => {
        return this.responseMapper.mapMultipleTypeResponse(response);
      })
    );
  }

  /**
   * Gets single taxonomy from given url
   * @param url Url used to get single taxonomy
   * @param queryConfig Query configuration
   */
  getTaxonomy(
    url: string,
    queryConfig: ITaxonomyQueryConfig
  ): Observable<TaxonomyResponses.TaxonomyResponse> {
    return this.getResponse<TaxonomyContracts.ITaxonomyResponseContract>(url, queryConfig).pipe(
      map(response => {
        return this.responseMapper.mapTaxonomyResponse(response);
      })
    );
  }

  /**
   * Gets multiple taxonomies from given url
   * @param url Url used to get multiple taxonomies
   * @param queryConfig Query configuration
   */
  getTaxonomies(
    url: string,
    queryConfig: ITaxonomyQueryConfig
  ): Observable<TaxonomyResponses.TaxonomiesResponse> {
    return this.getResponse<TaxonomyContracts.ITaxonomiesResponseContract>(url, queryConfig).pipe(
      map(response => {
        return this.responseMapper.mapTaxonomiesResponse(response);
      })
    );
  }

  /**
   * Gets single content type element from given url
   * @param url Url used to get single content type element
   * @param queryConfig Query configuration
   */
  getElement(
    url: string,
    queryConfig: ITaxonomyQueryConfig
  ): Observable<ElementResponses.ElementResponse> {
    return this.getResponse<ElementContracts.IElementResponseContract>(url, queryConfig).pipe(
      map(response => {
        return this.responseMapper.mapElementResponse(response);
      })
    );
  }


}
