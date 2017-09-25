// config
import { DeliveryClientConfig } from '../config/delivery-client.config';

// rxjs
import { AjaxResponse } from 'rxjs/observable/dom/AjaxObservable';

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

// services
import { ItemMapService } from '../services/item-map.service';
import { TypeMapService } from '../services/type-map.service';
import { TaxonomyMapService } from '../services/taxonomy-map.service';

export class ResponseMapService {

    /**
     * Service used to map 'content types'
     */
    private readonly typeMapService: TypeMapService;

    /**
     * Service used to map 'content items'
     */
    private readonly itemMapService: ItemMapService;

    /**
     * Service used to map 'taxonomies'
     */
    private readonly taxonomyMapService: TaxonomyMapService;

    constructor(config: DeliveryClientConfig){
        this.typeMapService = new TypeMapService();
        this.itemMapService = new ItemMapService(config);
        this.taxonomyMapService = new TaxonomyMapService()
    }

    /**
     * Gets response for getting a single type
     * @param ajaxResponse Response data 
     */
    mapSingleTypeResponse(ajaxResponse: AjaxResponse): TypeResponses.DeliveryTypeResponse {
        var cloudResponse = ajaxResponse.response as CloudTypeResponseInterfaces.ICloudSingleTypeResponse;

        // map type
        var type = this.typeMapService.mapSingleType(cloudResponse);

        return new TypeResponses.DeliveryTypeResponse(type, this.mapResponseDebug(ajaxResponse));
    }

    /**
     * Gets resposne for getting multiple types
     * @param ajaxResponse Response data 
     * @param options Options
     */
    mapMultipleTypeResponse(ajaxResponse: AjaxResponse): TypeResponses.DeliveryTypeListingResponse {
        var cloudResponse = ajaxResponse.response as CloudTypeResponseInterfaces.ICloudMultipleTypeResponse;

        // map types
        var types = this.typeMapService.mapMultipleTypes(cloudResponse);

        // pagination
        var pagination = new Pagination(
            cloudResponse.pagination.skip,
            cloudResponse.pagination.limit,
            cloudResponse.pagination.count,
            cloudResponse.pagination.next_page
        );

        return new TypeResponses.DeliveryTypeListingResponse(types, pagination, this.mapResponseDebug(ajaxResponse));
    }

    /**
     * Gets response for getting single item
     * @param ajaxResponse Response data 
     * @param queryConfig Query configuration 
     */
    mapSingleResponse<TItem extends IContentItem>(ajaxResponse: AjaxResponse, queryConfig: IItemQueryConfig): ItemResponses.DeliveryItemResponse<TItem> {
        var cloudResponse = ajaxResponse.response as CloudItemResponseInterfaces.ICloudResponseSingle;

        // map item
        var item = this.itemMapService.mapSingleItem<TItem>(cloudResponse, queryConfig);

        return new ItemResponses.DeliveryItemResponse(item, this.mapResponseDebug(ajaxResponse));
    }

    /**
     * Gets response for getting multiple items
     * @param ajaxResponse Response data 
     * @param queryConfig Query configuration 
     */
    mapMultipleResponse<TItem extends IContentItem>(ajaxResponse: AjaxResponse, queryConfig: IItemQueryConfig): ItemResponses.DeliveryItemListingResponse<TItem> {
        var cloudResponse = ajaxResponse.response as CloudItemResponseInterfaces.ICloudResponseMultiple;

        // map items
        var items = this.itemMapService.mapMultipleItems<TItem>(cloudResponse, queryConfig);

        // pagination
        var pagination = new Pagination(
            cloudResponse.pagination.skip,
            cloudResponse.pagination.limit,
            cloudResponse.pagination.count,
            cloudResponse.pagination.next_page
        );

        return new ItemResponses.DeliveryItemListingResponse(items, pagination, this.mapResponseDebug(ajaxResponse));
    }

    /**
     * Gets response for getting single taxonomy item
     * @param ajaxResponse Response data 
     */
    mapTaxonomyResponse(ajaxResponse: AjaxResponse): TaxonomyResponses.TaxonomyResponse {
        var cloudResponse = ajaxResponse.response as CloudTaxonomyResponseInterfaces.ICloudTaxonomyResponse;

        // map taxonomy 
        var taxonomy = this.taxonomyMapService.mapTaxonomy(cloudResponse.system, cloudResponse.terms);

        return new TaxonomyResponses.TaxonomyResponse(taxonomy.system, taxonomy.terms, this.mapResponseDebug(ajaxResponse));
    }

    /**
     * Gets response for getting multiples taxonomies
     * @param ajaxResponse Response data 
     */
    mapTaxonomiesResponse(ajaxResponse: AjaxResponse): TaxonomyResponses.TaxonomiesResponse {
        var cloudResponse = ajaxResponse.response as CloudTaxonomyResponseInterfaces.ICloudTaxonomiesResponse;

        // map taxonomies
        var taxonomies = this.taxonomyMapService.mapTaxonomies(cloudResponse.taxonomies);

        return new TaxonomyResponses.TaxonomiesResponse(taxonomies, this.mapResponseDebug(ajaxResponse));
    }

    private mapResponseDebug(ajaxResponse: AjaxResponse) : CloudResponseDebug {
        if (!ajaxResponse){
            throw Error(`Cannot map 'debug' model from the response`);
        }

        return new CloudResponseDebug(ajaxResponse);
    }
}