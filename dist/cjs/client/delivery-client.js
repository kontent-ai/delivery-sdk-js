"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryClient = void 0;
const kontent_core_1 = require("@kentico/kontent-core");
const parser_adapter_1 = require("../parser/parser-adapter");
const query_1 = require("../query");
const sdk_info_generated_1 = require("../sdk-info.generated");
const services_1 = require("../services");
class DeliveryClient {
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
        this.mappingService = new services_1.MappingService(config, config.richTextParserAdapter ? config.richTextParserAdapter : parser_adapter_1.getParserAdapter());
        this.queryService = new services_1.QueryService(config, config.httpService
            ? config.httpService
            : new kontent_core_1.HttpService({
                requestInterceptor: config.httpInterceptors && config.httpInterceptors.requestInterceptor
                    ? config.httpInterceptors.requestInterceptor
                    : undefined,
                responseInterceptor: config.httpInterceptors && config.httpInterceptors.responseInterceptor
                    ? config.httpInterceptors.responseInterceptor
                    : undefined
            }), {
            host: sdk_info_generated_1.sdkInfo.host,
            name: sdk_info_generated_1.sdkInfo.name,
            version: sdk_info_generated_1.sdkInfo.version
        }, this.mappingService);
    }
    /**
     * Gets query for multiple languages
     */
    languages() {
        return new query_1.LanguagesQuery(this.config, this.queryService);
    }
    /**
     * Gets query for multiple types
     */
    types() {
        return new query_1.MultipleTypeQuery(this.config, this.queryService);
    }
    /**
     * Gets query for single type
     * @param {string} typeCodename - Codename of the type to fetch
     */
    type(typeCodename) {
        return new query_1.SingleTypeQuery(this.config, this.queryService, typeCodename);
    }
    /**
     * Gets query for multiple items
     */
    items() {
        return new query_1.MultipleItemQuery(this.config, this.queryService);
    }
    /**
     * Gets query for single item
     * @param {string} codename - Codename of item to fetch
     */
    item(codename) {
        return new query_1.SingleItemQuery(this.config, this.queryService, codename);
    }
    /**
     * Gets query for items feed. Executes single HTTP request only. Might not get all items from your Kontent project.
     */
    itemsFeed() {
        return new query_1.ItemsFeedQuery(this.config, this.queryService);
    }
    /**
     * Gets query for all items feed. This may execute multiple HTTP calls depending on number of items in your Kontent project.
     */
    itemsFeedAll() {
        return new query_1.ItemsFeedQueryAll(this.config, this.queryService);
    }
    /**
     * Gets query for single taxonomy
     * @param {string} codename - Codename of taxonomy to fetch
     */
    taxonomy(codename) {
        return new query_1.TaxonomyQuery(this.config, this.queryService, codename);
    }
    /**
     * Gets query for multiple taxonomies
     */
    taxonomies() {
        return new query_1.TaxonomiesQuery(this.config, this.queryService);
    }
    /**
     * Gets query for an element within a type
     * @param {string} typeCodename - Codename of the type
     * @param {string} elementCodename - Codename of the element
     */
    element(typeCodename, elementCodename) {
        return new query_1.ElementQuery(this.config, this.queryService, typeCodename, elementCodename);
    }
}
exports.DeliveryClient = DeliveryClient;
//# sourceMappingURL=delivery-client.js.map