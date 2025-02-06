import { ClientTypes as TClientTypes, IContentItem } from '../models';
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

export interface IDeliveryClient<
    T extends TClientTypes = {
        readonly contentItemType: IContentItem;
        readonly contentTypeCodenames: string;
        readonly workflowCodenames: string;
        readonly worfklowStepCodenames: string;
        readonly collectionCodenames: string;
        readonly taxonomyCodenames: string;
        readonly languageCodenames: string;
        readonly elementCodenames: string;
    }
> {
    /**
     * Mapping service - can be used to get strongly typed responses from json result
     */
    mappingService: IMappingService<T>;

    /**
     * Gets query for languages
     */
    languages(): LanguagesQuery<T>;

    /**
     * Gets query for multiple types
     */
    types(): MultipleTypeQuery<T>;

    /**
     * Gets query for single type
     * @param {string} typeCodename - Codename of the type to retrieve
     */
    type(typeCodename: T['contentTypeCodenames']): SingleTypeQuery<T>;

    /**
     * Gets query for multiple items
     */
    items<TContentItem extends IContentItem = T['contentItemType']>(): MultipleItemsQuery<T, TContentItem>;

    /**
     * Gets query for items feed. Executes single HTTP request only
     */
    itemsFeed<TContentItem extends IContentItem = T['contentItemType']>(): ItemsFeedQuery<T, TContentItem>;

    /**
     * Gets query for single item
     * @param {string} codename - Codename of item to retrieve
     */
    item<TContentItem extends IContentItem = T['contentItemType']>(codename: string): SingleItemQuery<T, TContentItem>;

    /**
     * Gets query for multiple taxonomies
     */
    taxonomies(): TaxonomiesQuery<T>;

    /**
     * Gets query for single item
     * @param {string} codename - Codename of taxonomy to retrieve
     */
    taxonomy(codename: T['taxonomyCodenames']): TaxonomyQuery<T>;

    /**
     * Gets query for an element within a type
     */
    element(typeCodename: T['contentTypeCodenames'], elementCodename: T['elementCodenames']): ElementQuery<T>;

    /**
     * Gets query for initializing sync
     */
    initializeSync(): InitializeSyncQuery<T>;

    /**
     * Gets query fetching delta updates of content items
     */
    syncChanges(): SyncChangesQuery<T>;
}
