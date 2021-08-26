import { HttpService } from '@kentico/kontent-core';
import { getParserAdapter } from '../parser/parser-adapter';
import { ElementQuery, ItemsFeedQuery, MultipleItemQuery, MultipleTypeQuery, SingleItemQuery, SingleTypeQuery, TaxonomiesQuery, TaxonomyQuery, ItemsFeedQueryAll, LanguagesQuery } from '../query';
import { sdkInfo } from '../sdk-info.generated';
import { MappingService, QueryService } from '../services';
export class DeliveryClient {
    /**
     * Delivery client used to fetch data from Kentico Kontent
     * @constructor
     * @param {IDeliveryClientConfig} config - The client configuration
     */
    constructor(config) {
        this.config = config;
        if (!config) {
            throw Error(`Delivery client configuration is not set`);
        }
        this.mappingService = new MappingService(config, config.richTextParserAdapter ? config.richTextParserAdapter : getParserAdapter());
        this.queryService = new QueryService(config, config.httpService
            ? config.httpService
            : new HttpService({
                requestInterceptor: config.httpInterceptors && config.httpInterceptors.requestInterceptor
                    ? config.httpInterceptors.requestInterceptor
                    : undefined,
                responseInterceptor: config.httpInterceptors && config.httpInterceptors.responseInterceptor
                    ? config.httpInterceptors.responseInterceptor
                    : undefined
            }), {
            host: sdkInfo.host,
            name: sdkInfo.name,
            version: sdkInfo.version
        }, this.mappingService);
    }
    /**
     * Gets query for multiple languages
     */
    languages() {
        return new LanguagesQuery(this.config, this.queryService);
    }
    /**
     * Gets query for multiple types
     */
    types() {
        return new MultipleTypeQuery(this.config, this.queryService);
    }
    /**
     * Gets query for single type
     * @param {string} typeCodename - Codename of the type to fetch
     */
    type(typeCodename) {
        return new SingleTypeQuery(this.config, this.queryService, typeCodename);
    }
    /**
     * Gets query for multiple items
     */
    items() {
        return new MultipleItemQuery(this.config, this.queryService);
    }
    /**
     * Gets query for single item
     * @param {string} codename - Codename of item to fetch
     */
    item(codename) {
        return new SingleItemQuery(this.config, this.queryService, codename);
    }
    /**
     * Gets query for items feed. Executes single HTTP request only. Might not get all items from your Kontent project.
     */
    itemsFeed() {
        return new ItemsFeedQuery(this.config, this.queryService);
    }
    /**
     * Gets query for all items feed. This may execute multiple HTTP calls depending on number of items in your Kontent project.
     */
    itemsFeedAll() {
        return new ItemsFeedQueryAll(this.config, this.queryService);
    }
    /**
     * Gets query for single taxonomy
     * @param {string} codename - Codename of taxonomy to fetch
     */
    taxonomy(codename) {
        return new TaxonomyQuery(this.config, this.queryService, codename);
    }
    /**
     * Gets query for multiple taxonomies
     */
    taxonomies() {
        return new TaxonomiesQuery(this.config, this.queryService);
    }
    /**
     * Gets query for an element within a type
     * @param {string} typeCodename - Codename of the type
     * @param {string} elementCodename - Codename of the element
     */
    element(typeCodename, elementCodename) {
        return new ElementQuery(this.config, this.queryService, typeCodename, elementCodename);
    }
}
//# sourceMappingURL=delivery-client.js.map