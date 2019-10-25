import { HttpService } from '@kentico/kontent-core';

import { IDeliveryClientConfig } from '../config';
import { ContentItem } from '../models';
import { getParserAdapter } from '../parser/parser-adapter';
import {
    ElementQuery,
    ItemsFeedQuery,
    MultipleItemQuery,
    MultipleTypeQuery,
    SingleItemQuery,
    SingleTypeQuery,
    TaxonomiesQuery,
    TaxonomyQuery,
    ItemsFeedQueryAll,
} from '../query';
import { sdkInfo } from '../sdk-info.generated';
import { IMappingService, MappingService, QueryService } from '../services';
import { IDeliveryClient } from './idelivery-client.interface';

export class DeliveryClient implements IDeliveryClient {
    private queryService: QueryService;
    public mappingService: IMappingService;

    /**
     * Delivery client used to fetch data from Kentico Kontent
     * @constructor
     * @param {IDeliveryClientConfig} config - The client configuration
     */
    constructor(protected config: IDeliveryClientConfig) {
        if (!config) {
            throw Error(`Delivery client configuration is not set`);
        }

        this.mappingService = new MappingService(config, getParserAdapter());
        this.queryService = new QueryService(
            config,
            config.httpService
                ? config.httpService
                : new HttpService({
                      requestInterceptor:
                          config.httpInterceptors && config.httpInterceptors.requestInterceptor
                              ? config.httpInterceptors.requestInterceptor
                              : undefined,
                      responseInterceptor:
                          config.httpInterceptors && config.httpInterceptors.responseInterceptor
                              ? config.httpInterceptors.responseInterceptor
                              : undefined
                  }),
            {
                host: sdkInfo.host,
                name: sdkInfo.name,
                version: sdkInfo.version
            },
            this.mappingService
        );
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
     * Gets query for items feed. Executes single HTTP request only. Might not get all items from your Kontent project.
     */
    itemsFeed<TItem extends ContentItem>(): ItemsFeedQuery<TItem> {
        return new ItemsFeedQuery<TItem>(this.config, this.queryService);
    }

    /**
     * Gets query for all items feed. This may execute multiple HTTP calls depending on number of items in your Kontent project.
     */
    itemsFeedAll<TItem extends ContentItem>(): ItemsFeedQueryAll<TItem> {
        return new ItemsFeedQueryAll<TItem>(this.config, this.queryService);
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
