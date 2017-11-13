// config
import { DeliveryClientConfig } from '../config/delivery-client.config';

// models
import { ItemResponses } from '../models/item/responses';
import { CloudItemResponseInterfaces } from '../interfaces/item/cloud-responses';
import { Pagination } from '../models/common/pagination.class';
import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { CloudTypeResponseInterfaces } from '../interfaces/type/cloud-responses';
import { IQueryParameter } from '../interfaces/common/iquery-parameter.interface';
import { TypeResponses } from '../models/type/responses';
import { IItemQueryConfig } from '../interfaces/item/iitem-query.config';
import { TaxonomyResponses } from '../models/taxonomy/responses';
import { CloudTaxonomyResponseInterfaces } from '../interfaces/taxonomy/cloud-responses';
import { ICloudResponseDebug } from '../interfaces/common/icloud-response-debug.interface';
import { CloudResponseDebug } from '../models/common/cloud-response-debug.class';
import { CloudElementResponseInterfaces } from '../interfaces/element/cloud-responses';
import { ElementResponses } from '../models/element/responses';
import { BaseResponse } from '../services/http/base-response.class';

// services
import { ItemMapService } from './item-map.service';
import { TypeMapService } from './type-map.service';
import { TaxonomyMapService } from './taxonomy-map.service';
import { ElementMapService } from './element-map.service';

export class ResponseMapService {

    /**
     * Service used to map content types
     */
    private readonly typeMapService: TypeMapService;

    /**
     * Service used to map content items
     */
    private readonly itemMapService: ItemMapService;

    /**
     * Service used to map taxonomies
     */
    private readonly taxonomyMapService: TaxonomyMapService;

    /**
     * Services used to map elements
     */
    private readonly elementMapService: ElementMapService;

    constructor(config: DeliveryClientConfig) {
        this.typeMapService = new TypeMapService();
        this.itemMapService = new ItemMapService(config);
        this.taxonomyMapService = new TaxonomyMapService()
        this.elementMapService = new ElementMapService();
    }

    /**
     * Gets response for getting a single type
     * @param response Response data
     */
    mapSingleTypeResponse(response: BaseResponse): TypeResponses.DeliveryTypeResponse {
        const cloudResponse = response.data as CloudTypeResponseInterfaces.ICloudSingleTypeResponse;

        // map type
        const type = this.typeMapService.mapSingleType(cloudResponse);

        return new TypeResponses.DeliveryTypeResponse(type, this.mapResponseDebug(response));
    }

    /**
     * Gets resposne for getting multiple types
     * @param response Response data
     * @param options Options
     */
    mapMultipleTypeResponse(response: BaseResponse): TypeResponses.DeliveryTypeListingResponse {
        const cloudResponse = response.data as CloudTypeResponseInterfaces.ICloudMultipleTypeResponse;

        // map types
        const types = this.typeMapService.mapMultipleTypes(cloudResponse);

        // pagination
        const pagination = new Pagination(
            cloudResponse.pagination.skip,
            cloudResponse.pagination.limit,
            cloudResponse.pagination.count,
            cloudResponse.pagination.next_page
        );

        return new TypeResponses.DeliveryTypeListingResponse(types, pagination, this.mapResponseDebug(response));
    }

    /**
     * Gets response for getting single item
     * @param response Response data
     * @param queryConfig Query configuration
     */
    mapSingleResponse<TItem extends IContentItem>(response: BaseResponse, queryConfig: IItemQueryConfig): ItemResponses.DeliveryItemResponse<TItem> {
        const cloudResponse = response.data as CloudItemResponseInterfaces.ICloudResponseSingle;

        // map item
        const item = this.itemMapService.mapSingleItem<TItem>(cloudResponse, queryConfig);

        return new ItemResponses.DeliveryItemResponse(item, this.mapResponseDebug(response));
    }

    /**
     * Gets response for getting multiple items
     * @param response Response data
     * @param queryConfig Query configuration
     */
    mapMultipleResponse<TItem extends IContentItem>(response: BaseResponse, queryConfig: IItemQueryConfig): ItemResponses.DeliveryItemListingResponse<TItem> {
        const cloudResponse = response.data as CloudItemResponseInterfaces.ICloudResponseMultiple;

        // map items
        const items = this.itemMapService.mapMultipleItems<TItem>(cloudResponse, queryConfig);

        // pagination
        const pagination = new Pagination(
            cloudResponse.pagination.skip,
            cloudResponse.pagination.limit,
            cloudResponse.pagination.count,
            cloudResponse.pagination.next_page
        );

        return new ItemResponses.DeliveryItemListingResponse(items, pagination, this.mapResponseDebug(response));
    }

    /**
     * Gets response for getting single taxonomy item
     * @param response Response data
     */
    mapTaxonomyResponse(response: BaseResponse): TaxonomyResponses.TaxonomyResponse {
        const cloudResponse = response.data as CloudTaxonomyResponseInterfaces.ICloudTaxonomyResponse;

        // map taxonomy
        const taxonomy = this.taxonomyMapService.mapTaxonomy(cloudResponse.system, cloudResponse.terms);

        return new TaxonomyResponses.TaxonomyResponse(taxonomy, this.mapResponseDebug(response));
    }

    /**
     * Gets response for getting multiples taxonomies
     * @param response Response data
     */
    mapTaxonomiesResponse(response: BaseResponse): TaxonomyResponses.TaxonomiesResponse {
        const cloudResponse = response.data as CloudTaxonomyResponseInterfaces.ICloudTaxonomiesResponse;

        // map taxonomies
        const taxonomies = this.taxonomyMapService.mapTaxonomies(cloudResponse.taxonomies);

        return new TaxonomyResponses.TaxonomiesResponse(taxonomies, this.mapResponseDebug(response));
    }

    /**
    * Gets response for getting single content type element
    * @param response Response data
    */
    mapElementResponse(response: BaseResponse): ElementResponses.ElementResponse {
        const cloudResponse = response.data as CloudElementResponseInterfaces.ICloudElementResponse;

        // map element
        const element = this.elementMapService.mapElement(cloudResponse);

        return new ElementResponses.ElementResponse(element, this.mapResponseDebug(response));
    }

    mapResponseDebug(response: BaseResponse): CloudResponseDebug {
        if (!response) {
            throw Error(`Cannot map 'debug' model from the response`);
        }

        return new CloudResponseDebug(response.response);
    }
}
