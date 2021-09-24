import { ItemContracts } from '../../data-contracts/item-contracts';
import { IDeliveryClientConfig } from '../../config';
import {
    Filters,
    IContentItem,
    IItemQueryConfig,
    IKontentNetworkResponse,
    ItemResponses,
    Parameters
} from '../../models';
import { QueryService } from '../../services';
import { BaseListingQuery } from '../common/base-listing-query.class';

export class ItemsFeedQuery<TContentItem extends IContentItem = IContentItem> extends BaseListingQuery<
    ItemResponses.IListItemsFeedResponse<TContentItem>,
    ItemResponses.IListItemsFeedAllResponse<TContentItem>,
    IItemQueryConfig,
    ItemContracts.IItemsFeedContract
> {
    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
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
    toPromise(): Promise<
        IKontentNetworkResponse<ItemResponses.IListItemsFeedResponse<TContentItem>, ItemContracts.IItemsFeedContract>
    > {
        return this.queryService.getItemsFeed(this.getUrl(), this._queryConfig ?? {});
    }

    /**
     * Gets 'Url' representation of query
     */
    getUrl(): string {
        const action = '/items-feed';

        // add default language is necessry
        this.processDefaultLanguageParameter();

        return super.resolveUrlInternal(action);
    }

    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: IItemQueryConfig): this {
        this._queryConfig = queryConfig;
        return this;
    }

    protected allResponseFactory(
        items: any[],
        responses: IKontentNetworkResponse<
            ItemResponses.IListItemsFeedResponse<TContentItem>,
            ItemContracts.IItemsFeedContract
        >[]
    ): ItemResponses.IListItemsFeedAllResponse<TContentItem> {
        return {
            items: items,
            responses: responses
        };
    }
}
