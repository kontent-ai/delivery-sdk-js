// rxjs
import { Observable } from 'rxjs/Rx';

// config
import { DeliveryClientConfig } from '../config/delivery-client.config';

// models
import { DeliveryItemListingResponse, DeliveryItemResponse } from '../models/item/responses';
import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { IQueryParameter } from '../interfaces/common/iquery-parameter.interface';
import { DeliveryTypeListingResponse, DeliveryTypeResponse } from '../models/type/responses';
import { EqualsFilter } from '../models/common/filters';
import { IItemQueryConfig } from '../interfaces/item/iitem-query.config';
import { ItemQueryConfig } from '../models/item/item-query.config';

// services
import { DeliveryClientBaseService } from './delivery-client-base.service';

export class DeliveryClient extends DeliveryClientBaseService {

    /**
    * Delivery client used to fetch data from Kentico Cloud
    * @constructor
    * @param {DeliveryClientConfig} config - The client configuration
    */
    constructor(
        protected config: DeliveryClientConfig
    ) {
        super(config)
    }

    /**
    * Retrieves list of content types in your project
    * @param {IQueryParameter[]} options - An optional collection of query parameters
    */
    getTypes(options?: IQueryParameter[]): Observable<DeliveryTypeListingResponse> {
        var action = '/types';

        return super.getMultipleTypes(action, options);
    }

    /**
    * Retrieves specified content type
    * @param {string} type - Codename of content type
    * @param {IQueryParameter[]} options - An optional collection of query parameters
    */
    getType(type: string, options?: IQueryParameter[]): Observable<DeliveryTypeResponse> {
        var action = '/types/' + type;

        return super.getSingleType(action, options);
    }

    /**
    * Retrieves content items of specified type and options
    * @param {string} type - Codename of content type whose items will be returned
    * @param {IQueryParameter[]} options - An optional collection of query parameters
    */
    getItems<TItem extends IContentItem>(type?: string, options?: IQueryParameter[], queryConfig?: IItemQueryConfig): Observable<DeliveryItemListingResponse<TItem>> {
        var action = '/items';

        if (!options) {
            options = [];
        }

        // get all items of all types when no type is specified
        if (type) {
            options.push(new EqualsFilter("system.type", type));
        }

        // use default config if none is provider
        if (!queryConfig) {
            queryConfig = new ItemQueryConfig();
        }

        return super.getMultipleItems(action, queryConfig, options);
    }

    /**
    * Retrieves specified content item based on codename
    * @param {string} type - Codename of content type to which the content item belongs
    * @param {string} codename - Codename of content item to be returned
    * @param {IQueryParameter[]} options - An optional collection of query parameters
    * @param {IQueryConfig} config - An optional configuration for this query
    */
    getItem<TItem extends IContentItem>(type: string, codename: string, options?: IQueryParameter[], queryConfig?: IItemQueryConfig): Observable<DeliveryItemResponse<TItem>> {
        var action = '/items/' + codename;

        // use default config if none is provider
        if (!queryConfig) {
            queryConfig = new ItemQueryConfig();
        }

        return super.getSingleItem(action, queryConfig, options);
    }
}