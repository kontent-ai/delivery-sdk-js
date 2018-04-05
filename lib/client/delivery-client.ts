import { IDeliveryClientConfig } from '../config/delivery-client.config';
import { packageId, repoHost, version } from '../library-version';
import { ContentItem } from '../models/item/content-item.class';
import { RichTextHtmlParser } from '../parser';
import { ElementQuery } from '../query/element/element-query.class';
import { MultipleItemQuery } from '../query/item/multiple-item-query.class';
import { SingleItemQuery } from '../query/item/single-item-query.class';
import { TaxonomiesQuery } from '../query/taxonomy/taxonomies-query.class';
import { TaxonomyQuery } from '../query/taxonomy/taxonomy-query.class';
import { MultipleTypeQuery } from '../query/type/multiple-type-query.class';
import { SingleTypeQuery } from '../query/type/single-type-query.class';
import { HttpService } from '../services/http/http.service';
import { QueryService } from '../services/query.service';
import { IDeliveryClient } from './idelivery-client.interface';

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
            new HttpService(),
            new RichTextHtmlParser(), {
                host: repoHost,
                name: packageId,
                version: version
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
