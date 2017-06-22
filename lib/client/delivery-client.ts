// config
import { DeliveryClientConfig } from '../config/delivery-client.config';

// interface
import { IDeliveryClient } from './idelivery-client.interface';

// models
import { IContentItem } from '../interfaces/item/icontent-item.interface';

// queries
import { SingleTypeQuery } from '../query/type/single-type-query.class';
import { MultipleTypeQuery } from '../query/type/multiple-type-query.class';
import { SingleItemQuery } from '../query/item/single-item-query.class';
import { MultipleItemQuery } from '../query/item/multiple-item-query.class';

// services
import { QueryService } from '../services/query.service';

export class DeliveryClient extends QueryService implements IDeliveryClient {

    /**
    * Delivery client used to fetch data from Kentico Cloud
    * @constructor
    * @param {DeliveryClientConfig} config - The client configuration
    */
    constructor(
        protected config: DeliveryClientConfig
    ) {
        super(config)

        if (!config){
            throw Error(`Cannot create 'DeliveryClient' without configuration`);
        }
    }

    /**
    * Gets query for multiple types
    */
    types(): MultipleTypeQuery {
        return new MultipleTypeQuery(this.config);
    }

    /**
    * Gets query for single type
    * @param {string} typeCodename - Codename of the type to retrieve
    */
    type(typeCodename: string): SingleTypeQuery {
        return new SingleTypeQuery(this.config, typeCodename);
    }


    /**
    * Gets query for multiple items
    */
    items<TItem extends IContentItem>(): MultipleItemQuery<TItem> {
        return new MultipleItemQuery<TItem>(this.config);
    }

    /**
    * Gets query for single item
    * @param {string} codename - Codename of item to retrieve
    */
    item<TItem extends IContentItem>(codename: string): SingleItemQuery<TItem> {
        return new SingleItemQuery<TItem>(this.config, codename);
    }
}