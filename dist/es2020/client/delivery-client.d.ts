import { IDeliveryClientConfig } from '../config';
import { ContentItem } from '../models';
import { ElementQuery, ItemsFeedQuery, MultipleItemQuery, MultipleTypeQuery, SingleItemQuery, SingleTypeQuery, TaxonomiesQuery, TaxonomyQuery, ItemsFeedQueryAll, LanguagesQuery } from '../query';
import { IMappingService } from '../services';
import { IDeliveryClient } from './idelivery-client.interface';
export declare class DeliveryClient implements IDeliveryClient {
    protected config: IDeliveryClientConfig;
    private queryService;
    mappingService: IMappingService;
    /**
     * Delivery client used to fetch data from Kentico Kontent
     * @constructor
     * @param {IDeliveryClientConfig} config - The client configuration
     */
    constructor(config: IDeliveryClientConfig);
    /**
     * Gets query for multiple languages
     */
    languages(): LanguagesQuery;
    /**
     * Gets query for multiple types
     */
    types(): MultipleTypeQuery;
    /**
     * Gets query for single type
     * @param {string} typeCodename - Codename of the type to fetch
     */
    type(typeCodename: string): SingleTypeQuery;
    /**
     * Gets query for multiple items
     */
    items<TItem extends ContentItem>(): MultipleItemQuery<TItem>;
    /**
     * Gets query for single item
     * @param {string} codename - Codename of item to fetch
     */
    item<TItem extends ContentItem>(codename: string): SingleItemQuery<TItem>;
    /**
     * Gets query for items feed. Executes single HTTP request only. Might not get all items from your Kontent project.
     */
    itemsFeed<TItem extends ContentItem>(): ItemsFeedQuery<TItem>;
    /**
     * Gets query for all items feed. This may execute multiple HTTP calls depending on number of items in your Kontent project.
     */
    itemsFeedAll<TItem extends ContentItem>(): ItemsFeedQueryAll<TItem>;
    /**
     * Gets query for single taxonomy
     * @param {string} codename - Codename of taxonomy to fetch
     */
    taxonomy(codename: string): TaxonomyQuery;
    /**
     * Gets query for multiple taxonomies
     */
    taxonomies(): TaxonomiesQuery;
    /**
     * Gets query for an element within a type
     * @param {string} typeCodename - Codename of the type
     * @param {string} elementCodename - Codename of the element
     */
    element(typeCodename: string, elementCodename: string): ElementQuery;
}
