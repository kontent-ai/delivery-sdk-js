import { HttpService } from '@kontent-ai/core-sdk';
import { IDeliveryClientConfig } from '../config';
import { ClientTypes, IContentItem } from '../models';
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

export class DeliveryClient<TClientTypes extends ClientTypes = ClientTypes> implements IDeliveryClient {
    private queryService: QueryService<TClientTypes>;
    public mappingService: IMappingService<TClientTypes>;

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
    languages(): LanguagesQuery<TClientTypes> {
        return new LanguagesQuery(this.config, this.queryService);
    }

    /**
     * Gets query for multiple types
     */
    types(): MultipleTypeQuery<TClientTypes> {
        return new MultipleTypeQuery(this.config, this.queryService);
    }

    /**
     * Gets query for single type
     * @param {string} typeCodename - Codename of the type to fetch
     */
    type(typeCodename: TClientTypes['contentTypeCodenames']): SingleTypeQuery<TClientTypes> {
        return new SingleTypeQuery(this.config, this.queryService, typeCodename);
    }

    /**
     * Gets query for multiple items
     */
    items<TContentItem extends IContentItem = TClientTypes['contentItemType']>(): MultipleItemsQuery<
        TClientTypes,
        TContentItem
    > {
        return new MultipleItemsQuery<TClientTypes, TContentItem>(this.config, this.queryService);
    }

    /**
     * Gets query for single item
     * @param {string} codename - Codename of item to fetch
     */
    item<TContentItem extends IContentItem = TClientTypes['contentItemType']>(
        codename: string
    ): SingleItemQuery<TClientTypes, TContentItem> {
        return new SingleItemQuery<TClientTypes, TContentItem>(this.config, this.queryService, codename);
    }

    /**
     * Gets query for items feed. Executes single HTTP request only
     */
    itemsFeed<TContentItem extends IContentItem = TClientTypes['contentItemType']>(): ItemsFeedQuery<
        TClientTypes,
        TContentItem
    > {
        return new ItemsFeedQuery<TClientTypes, TContentItem>(this.config, this.queryService);
    }

    /**
     * Gets query for single taxonomy
     * @param {string} codename - Codename of taxonomy to fetch
     */
    taxonomy(codename: TClientTypes['taxonomyCodenames']): TaxonomyQuery<TClientTypes> {
        return new TaxonomyQuery(this.config, this.queryService, codename);
    }

    /**
     * Gets query for multiple taxonomies
     */
    taxonomies(): TaxonomiesQuery<TClientTypes> {
        return new TaxonomiesQuery<TClientTypes>(this.config, this.queryService);
    }

    /**
     * Gets query for an element within a type
     * @param {string} typeCodename - Codename of the type
     * @param {string} elementCodename - Codename of the element
     */
    element(
        typeCodename: TClientTypes['contentTypeCodenames'],
        elementCodename: TClientTypes['elementCodenames']
    ): ElementQuery<TClientTypes> {
        return new ElementQuery(this.config, this.queryService, typeCodename, elementCodename);
    }

    /**
     * Gets query for initializing sync
     */
    initializeSync(): InitializeSyncQuery<TClientTypes> {
        return new InitializeSyncQuery(this.config, this.queryService);
    }

    /**
     * Gets query fetching delta updates of content items
     */
    syncChanges(): SyncChangesQuery<TClientTypes> {
        return new SyncChangesQuery(this.config, this.queryService);
    }
}
