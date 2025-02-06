import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import {
    Filters,
    IContentItem,
    IDeliveryNetworkResponse,
    Parameters,
    Responses,
    IItemFeedQueryConfig,
    ClientTypes
} from '../../models';
import { QueryService } from '../../services';
import { BaseItemListingQuery } from '../common/base-item-listing-query.class';

export class ItemsFeedQuery<
    TClientTypes extends ClientTypes,
    TContentItem extends IContentItem = IContentItem
> extends BaseItemListingQuery<
    TClientTypes,
    Responses.IListItemsFeedResponse<TContentItem, TClientTypes['contentItemType']>,
    Responses.IListItemsFeedAllResponse<TContentItem, TClientTypes['contentItemType']>,
    IItemFeedQueryConfig,
    Contracts.IItemsFeedContract
> {
    protected _queryConfig: IItemFeedQueryConfig = {};

    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService<TClientTypes>) {
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
     * Used to exclude elements returned by query.
     * @param elementCodenames Array of element codenames to exclude
     */
    excludeElementsParameter(elementCodenames: string[]): this {
        this.parameters.push(new Parameters.ExcludeElementsParameter(elementCodenames));
        return this;
    }

    toPromise(): Promise<
        IDeliveryNetworkResponse<
            Responses.IListItemsFeedResponse<TContentItem, TClientTypes['contentItemType']>,
            Contracts.IItemsFeedContract
        >
    > {
        return this.queryService.getItemsFeed(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        const action = '/items-feed';

        // add default language is necessary
        this.processDefaultLanguageParameter();

        //process client level archived item exclusion
        this.processExcludeArchivedItemsParameter();

        return super.resolveUrlInternal(action);
    }

    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: IItemFeedQueryConfig): this {
        this._queryConfig = queryConfig;
        return this;
    }

    map(json: any): Responses.IListItemsFeedResponse<TContentItem, TClientTypes['contentItemType']> {
        return this.queryService.mappingService.itemsFeedResponse(json);
    }

    protected allResponseFactory(
        items: TContentItem[],
        responses: IDeliveryNetworkResponse<
            Responses.IListItemsFeedResponse<TContentItem, TClientTypes['contentItemType']>,
            Contracts.IItemsFeedContract
        >[]
    ): Responses.IListItemsFeedAllResponse<TContentItem, TClientTypes['contentItemType']> {
        if (this.canLinkItems()) {
            this.linkFeedItems(items, responses);
        }

        return {
            items: items,
            responses: responses
        };
    }

    private linkFeedItems(
        items: TContentItem[],
        responses: IDeliveryNetworkResponse<
            Responses.IListItemsFeedResponse<TContentItem, TClientTypes['contentItemType']>,
            Contracts.IItemsFeedContract
        >[]
    ): void {
        // prepare all available items (including components) for linking
        const allAvailableContentItems: IContentItem[] = [];

        // process linked items (modular_content part of the response)
        for (const response of responses) {
            allAvailableContentItems.push(...Object.values(response.data.linkedItems));
        }

        // add standard items
        for (const item of items) {
            if (
                !allAvailableContentItems.find(
                    (m) => m.system.codename.toLowerCase() === item.system.codename.toLowerCase()
                )
            ) {
                allAvailableContentItems.push(item);
            }
        }
        // process main items
        this.linkItemsInRte(allAvailableContentItems);
    }

    private canLinkItems(): boolean {
        if (this.config.linkedItemsReferenceHandler === 'ignore') {
            return false;
        }

        if (this._queryConfig.disableItemLinking === true) {
            return false;
        }

        return true;
    }
}
