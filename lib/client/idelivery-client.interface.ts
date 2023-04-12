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
import { IMappingService } from '../services';

export interface IDeliveryClient {
    /**
     * Mapping service - can be used to get strongly typed responses from json result
     */
    mappingService: IMappingService;

    /**
     * Gets query for languages
     */
    languages(): LanguagesQuery;

    /**
     * Gets query for multiple types
     */
    types(): MultipleTypeQuery;

    /**
     * Gets query for single type
     * @param {string} typeCodename - Codename of the type to retrieve
     */
    type(typeCodename: string): SingleTypeQuery;

    /**
     * Gets query for multiple items
     */
    items<TContentItem extends IContentItem = IContentItem>(): MultipleItemsQuery<TContentItem>;

    /**
     * Gets query for items feed. Executes single HTTP request only. Might not get all items from your Kontent.ai project.
     */
    itemsFeed<TContentItem extends IContentItem = IContentItem>(): ItemsFeedQuery<TContentItem>;

    /**
     * Gets query for single item
     * @param {string} codename - Codename of item to retrieve
     */
    item<TContentItem extends IContentItem = IContentItem>(codename: string): SingleItemQuery<TContentItem>;

    /**
     * Gets query for multiple taxonomies
     */
    taxonomies(): TaxonomiesQuery;

    /**
     * Gets query for single item
     * @param {string} codename - Codename of taxonomy to retrieve
     */
    taxonomy(codename: string): TaxonomyQuery;

    /**
     * Gets query for an element within a type
     */
    element(typeCodename: string, elementCodename: string): ElementQuery;

    /**
     * Gets query for initializing sync
     */
    initializeSync(): InitializeSyncQuery;

    /**
     * Gets query fetching delta updates of content items
     */
    syncChanges(): SyncChangesQuery;
}
