import { IDeliveryClientConfig } from '../config';
import { ContentItem } from '../models';
import {
    ElementQuery,
    MultipleItemQuery,
    MultipleTypeQuery,
    SingleItemQuery,
    SingleTypeQuery,
    TaxonomiesQuery,
    TaxonomyQuery,
} from '../query';
import { sdkInfo } from '../sdk-info.generated';
import { AxiosHttpService, QueryService } from '../services';
import { IDeliveryClient } from './idelivery-client.interface';
import { getParserAdapter } from '../parser/parser-adapter';

export class DeliveryClient implements IDeliveryClient {

    private queryService: QueryService;

    /**
    * Delivery client used to fetch data from Kentico Cloud
    * @constructor
    * @param {IDeliveryClientConfig} config - The client configuration
    */
    constructor(
        protected config: IDeliveryClientConfig,
    ) {

        if (!config) {
            throw Error(`Please provide Delivery client configuration`);
        }

        this.queryService = new QueryService(config,
            new AxiosHttpService(),
            getParserAdapter(),
            {
                host: sdkInfo.host,
                name: sdkInfo.name,
                version: sdkInfo.version
            });
    }

    /**
    * Gets query for multiple types
    */
    types(): MultipleTypeQuery {
        return new MultipleTypeQuery(this.config, this.queryService);
    }

    /**
    * Gets query for single type
    * @param {string} typeCodename - Codename of the type to fetch
    */
    type(typeCodename: string): SingleTypeQuery {
        return new SingleTypeQuery(this.config, this.queryService, typeCodename);
    }


    /**
    * Gets query for multiple items
    */
    items<TItem extends ContentItem>(): MultipleItemQuery<TItem> {
        return new MultipleItemQuery<TItem>(this.config, this.queryService);
    }

    /**
    * Gets query for single item
    * @param {string} codename - Codename of item to fetch
    */
    item<TItem extends ContentItem>(codename: string): SingleItemQuery<TItem> {
        return new SingleItemQuery<TItem>(this.config, this.queryService, codename);
    }

    /**
    * Gets query for single taxonomy
    * @param {string} codename - Codename of taxonomy to fetch
    */
    taxonomy(codename: string): TaxonomyQuery {
        return new TaxonomyQuery(this.config, this.queryService, codename);
    }

    /**
    * Gets query for multiple taxonomies
    */
    taxonomies(): TaxonomiesQuery {
        return new TaxonomiesQuery(this.config, this.queryService);
    }

    /**
     * Gets query for an element within a type
     * @param {string} typeCodename - Codename of the type
     * @param {string} elementCodename - Codename of the element
     */
    element(typeCodename: string, elementCodename: string): ElementQuery {
        return new ElementQuery(this.config, this.queryService, typeCodename, elementCodename);
    }
}
