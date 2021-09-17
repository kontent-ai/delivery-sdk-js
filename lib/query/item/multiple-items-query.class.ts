import { IDeliveryClientConfig } from '../../config';
import {
    ContentItem,
    Filters,
    IItemQueryConfig,
    IKontentNetworkResponse,
    ItemResponses,
    Parameters
} from '../../models';
import { QueryService } from '../../services';
import { BaseListingQuery } from '../common/base-listing-query.class';

export class MultipleItemsQuery<TItem extends ContentItem> extends BaseListingQuery<
    ItemResponses.ListContentItemsResponse<TItem>,
    ItemResponses.ListContentItemsAllResponse<TItem>,
    IItemQueryConfig
> {
    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
    }

    /**
     * Adds information about the total number of content items matching your query.
     * When set to true, the pagination object returned in the API response contains
     * an additional total_count property.
     */
    includeTotalCountParameter(): this {
        this.parameters.push(new Parameters.IncludeTotalCountParameter());
        return this;
    }

    /**
     * Gets only item of given type
     * @param type Codename of type to get
     */
    type(type: string): this {
        this.parameters.push(new Filters.TypeFilter(type));
        return this;
    }

    /**
     * Gets items of given types (logical or)
     * I.e. get items of either 'Actor' or 'Movie' type
     * @param types Types to get
     */
    types(types: string[]): this {
        this.parameters.push(new Filters.TypeFilter(types));
        return this;
    }

    /**
     * Gets only item from given collection
     * @param collection Codename of collection to get
     */
    collection(collection: string): this {
        this.parameters.push(new Filters.CollectionFilter(collection));
        return this;
    }

    /**
     * Gets items from given collections (logical or)
     * I.e. get items of either 'default' or 'christmas-campaign' collection
     * @param collections Collections to get
     */
    collections(collections: string[]): this {
        this.parameters.push(new Filters.CollectionFilter(collections));
        return this;
    }

    /**
     * Indicates depth of query that affects loading of nested linked items.
     * @param depth Depth of the query (> 0)
     */
    depthParameter(depth: number): this {
        this.parameters.push(new Parameters.DepthParameter(depth));
        return this;
    }

    /**
     * Language codename
     * @param languageCodename Codename of the language
     */
    languageParameter(languageCodename: string): this {
        this.parameters.push(new Parameters.LanguageParameter(languageCodename));
        return this;
    }

    /**
     * Used to limit the number of elements returned by query.
     * @param elementCodenames Array of element codenames to fetch
     */
    elementsParameter(elementCodenames: string[]): this {
        this.parameters.push(new Parameters.ElementsParameter(elementCodenames));
        return this;
    }

    /**
     * Gets the runnable Promise
     */
    toPromise(): Promise<IKontentNetworkResponse<ItemResponses.ListContentItemsResponse<TItem>>> {
        return this.queryService.getMultipleItems(this.getUrl(), this._queryConfig ?? {});
    }

    /**
     * Gets 'Url' representation of query
     */
    getUrl(): string {
        const action = '/items';

        // add default language is necessry
        this.processDefaultLanguageParameter();

        return super.resolveUrlInternal(action);
    }

    protected allResponseFactory(
        items: any[],
        responses: IKontentNetworkResponse<ItemResponses.ListContentItemsResponse<TItem>>[]
    ): ItemResponses.ListContentItemsAllResponse<TItem> {
        return new ItemResponses.ListContentItemsAllResponse<TItem>(items, responses);
    }
}
