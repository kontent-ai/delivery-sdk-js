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
     * @param json Json 
     */
    mapSingleTypeResponse(json: any): TypeResponses.DeliveryTypeResponse {
        var cloudResponse = json as CloudTypeResponseInterfaces.ICloudSingleTypeResponse;

        // map type
        var type = this.typeMapService.mapSingleType(cloudResponse);

        return new TypeResponses.DeliveryTypeResponse(type);
    }

    /**
     * Gets resposne for getting multiple types
     * @param json Json
     * @param options Options
     */
    mapMultipleTypeResponse(json: any, options?: IQueryParameter[]): TypeResponses.DeliveryTypeListingResponse {
        var cloudResponse = json as CloudTypeResponseInterfaces.ICloudMultipleTypeResponse;

        // map types
        var types = this.typeMapService.mapMultipleTypes(cloudResponse);

        // pagination
        var pagination = new Pagination(
            cloudResponse.pagination.skip,
            cloudResponse.pagination.limit,
            cloudResponse.pagination.count,
            cloudResponse.pagination.next_page
        );

        return new TypeResponses.DeliveryTypeListingResponse(types, pagination);
    }

    /**
     * Gets response for getting single item
     * @param json Raw json of the Kentico Cloud response
     * @param queryConfig Query configuration 
     */
    mapSingleResponse<TItem extends IContentItem>(json: any, queryConfig: IItemQueryConfig): ItemResponses.DeliveryItemResponse<TItem> {
        var cloudResponse = json as CloudItemResponseInterfaces.ICloudResponseSingle;

        // map item
        var item = this.itemMapService.mapSingleItem<TItem>(cloudResponse, queryConfig);

        return new ItemResponses.DeliveryItemResponse(item);
    }

    /**
     * Gets response for getting multiple items
     * @param json Raw json of the Kentico Cloud response
     * @param queryConfig Query configuration 
     */
    mapMultipleResponse<TItem extends IContentItem>(json: any, queryConfig: IItemQueryConfig): ItemResponses.DeliveryItemListingResponse<TItem> {
        var cloudResponse = json as CloudItemResponseInterfaces.ICloudResponseMultiple;

        // map items
        var items = this.itemMapService.mapMultipleItems<TItem>(cloudResponse, queryConfig);

        // pagination
        var pagination = new Pagination(
            cloudResponse.pagination.skip,
            cloudResponse.pagination.limit,
            cloudResponse.pagination.count,
            cloudResponse.pagination.next_page
        );

        return new ItemResponses.DeliveryItemListingResponse(items, pagination);
    }

    /**
     * Gets response for getting single taxonomy item
     * @param json Raw json of the Kentico Cloud taxonomy response
     */
    mapTaxonomyResponse(json: any): TaxonomyResponses.TaxonomyResponse {
        var cloudResponse = json as CloudTaxonomyResponseInterfaces.ICloudTaxonomyResponse;

        // map taxonomy 
        var taxonomy = this.taxonomyMapService.mapTaxonomy(cloudResponse.system, cloudResponse.terms);

        return new TaxonomyResponses.TaxonomyResponse(taxonomy.system, taxonomy.terms);
    }

    /**
     * Gets response for getting multiples taxonomies
     * @param json Raw json of the Kentico Cloud taxonomy response
     */
    mapTaxonomiesResponse(json: any): TaxonomyResponses.TaxonomiesResponse {
        var cloudResponse = json as CloudTaxonomyResponseInterfaces.ICloudTaxonomiesResponse;

        // map taxonomies
        var taxonomies = this.taxonomyMapService.mapTaxonomies(cloudResponse.taxonomies);

        return new TaxonomyResponses.TaxonomiesResponse(taxonomies);
    }
}