import { HttpService } from '@kontent-ai/core-sdk';

import { IDeliveryClientConfig } from '../config';
import { IContentItem } from '../models';
import {
    ElementQuery,
    ItemsFeedQuery,
    MultipleItemsQuery,
    MultipleTypeQuery,
    SingleItemQuery,
    SingleTypeQuery,
    TaxonomiesQuery,
    TaxonomyQuery,
    LanguagesQuery,
    InitializeSyncQuery,
    SyncChangesQuery
} from '../query';
import { sdkInfo } from '../sdk-info.generated';
import { IMappingService, MappingService, QueryService } from '../services';
import { IDeliveryClient } from './idelivery-client.interface';

export class DeliveryClient implements IDeliveryClient {
    private queryService: QueryService;
    public mappingService: IMappingService;

    /**
     * Delivery client used to fetch data from Kontent.ai
     * @constructor
     * @param {IDeliveryClientConfig} config - The client configuration
     */
    constructor(protected config: IDeliveryClientConfig) {
        if (!config) {
            throw Error(`Delivery client configuration is not set`);
        }

        this.mappingService = new MappingService(config);
        this.queryService = new QueryService(
            config,
            config.httpService ? config.httpService : new HttpService(),
            {
                host: sdkInfo.host,
                name: sdkInfo.name,
                version: sdkInfo.version
            },
            this.mappingService
        );
    }

    /**
     * Gets query for multiple languages
     */
    languages(): LanguagesQuery {
        return new LanguagesQuery(this.config, this.queryService);
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
    items<TContentItem extends IContentItem = IContentItem>(): MultipleItemsQuery<TContentItem> {
        return new MultipleItemsQuery<TContentItem>(this.config, this.queryService);
    }

    /**
     * Gets query for single item
     * @param {string} codename - Codename of item to fetch
     */
    item<TContentItem extends IContentItem = IContentItem>(codename: string): SingleItemQuery<TContentItem> {
        return new SingleItemQuery<TContentItem>(this.config, this.queryService, codename);
    }

    /**
     * Gets query for items feed. Executes single HTTP request only. Might not get all items from your Kontent.ai project.
     */
    itemsFeed<TContentItem extends IContentItem = IContentItem>(): ItemsFeedQuery<TContentItem> {
        return new ItemsFeedQuery<TContentItem>(this.config, this.queryService);
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

    /**
     * Gets query for initializing sync
     */
    initializeSync(): InitializeSyncQuery {
        return new InitializeSyncQuery(this.config, this.queryService);
    }

    /**
     * Gets query fetching delta updates of content items
     */
    syncChanges(): SyncChangesQuery {
        return new SyncChangesQuery(this.config, this.queryService);
    }
}
