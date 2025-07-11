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
    SyncChangesQuery,
    UsedInQuery
} from '../query';
import { IMappingService } from '../services';

export interface IDeliveryClient<TClientTypes extends ClientTypes = ClientTypes> {
    /**
     * Mapping service - can be used to get strongly typed responses from json result
     */
    mappingService: IMappingService<TClientTypes>;

    /**
     * Gets query for languages
     */
    languages(): LanguagesQuery<TClientTypes>;

    /**
     * Gets query for multiple types
     */
    types(): MultipleTypeQuery<TClientTypes>;

    /**
     * Gets query for single type
     * @param {string} typeCodename - Codename of the type to retrieve
     */
    type(typeCodename: TClientTypes['contentTypeCodenames']): SingleTypeQuery<TClientTypes>;

    /**
     * Gets query for multiple items
     */
    items<TContentItem extends IContentItem = TClientTypes['contentItemType']>(): MultipleItemsQuery<
        TClientTypes,
        TContentItem
    >;

    /**
     * Gets query for items feed. Executes single HTTP request only
     */
    itemsFeed<TContentItem extends IContentItem = TClientTypes['contentItemType']>(): ItemsFeedQuery<
        TClientTypes,
        TContentItem
    >;

    /**
     * Gets query for single item
     * @param {string} codename - Codename of item to retrieve
     */
    item<TContentItem extends IContentItem = TClientTypes['contentItemType']>(
        codename: string
    ): SingleItemQuery<TClientTypes, TContentItem>;

    /**
     * Gets query for multiple taxonomies
     */
    taxonomies(): TaxonomiesQuery<TClientTypes>;

    /**
     * Gets query for single item
     * @param {string} codename - Codename of taxonomy to retrieve
     */
    taxonomy(codename: TClientTypes['taxonomyCodenames']): TaxonomyQuery<TClientTypes>;

    /**
     * Gets query for an element within a type
     */
    element(
        typeCodename: TClientTypes['contentTypeCodenames'],
        elementCodename: TClientTypes['elementCodenames']
    ): ElementQuery<TClientTypes>;

    /**
     * @deprecated Sync API v1 is deprecated and will be shut down by the end of this year.
     * Please migrate to Sync API v2 using the `@kontent-ai/sync-sdk` package.
     *
     * For migration guidance and full documentation, visit:
     * https://kontent.ai/learn/docs/apis/openapi/sync-api-v2/
     */
    initializeSync(): InitializeSyncQuery<TClientTypes>;

    /**
     * @deprecated Sync API v1 is deprecated and will be shut down by the end of this year.
     * Please migrate to Sync API v2 using the `@kontent-ai/sync-sdk` package.
     *
     * For migration guidance and full documentation, visit:
     * https://kontent.ai/learn/docs/apis/openapi/sync-api-v2/
     */
    syncChanges(): SyncChangesQuery<TClientTypes>;

    /**
     * Item listing of where an asset is used
     */
    assetUsedIn(assetCodename: string): UsedInQuery<TClientTypes>;

    /**
     * Item listing of where a content item is used
     */
    itemUsedIn(itemCodename: string): UsedInQuery<TClientTypes>;
}
