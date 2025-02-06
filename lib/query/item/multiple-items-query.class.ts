import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import {
    Filters,
    IContentItem,
    IItemQueryConfig,
    IDeliveryNetworkResponse,
    Responses,
    Parameters,
    ClientTypes
} from '../../models';
import { QueryService } from '../../services';
import { BaseItemListingQuery } from '../common/base-item-listing-query.class';

export class MultipleItemsQuery<
    TClientTypes extends ClientTypes,
    TContentItem extends IContentItem = IContentItem
> extends BaseItemListingQuery<
    TClientTypes,
    Responses.IListContentItemsResponse<TContentItem, TClientTypes['contentItemType']>,
    Responses.IListContentItemsAllResponse<TContentItem, TClientTypes['contentItemType']>,
    IItemQueryConfig,
    Contracts.IListContentItemsContract
> {
    protected _queryConfig: IItemQueryConfig = {};

    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService<TClientTypes>) {
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
    type(type: TClientTypes['contentTypeCodenames']): this {
        this.parameters.push(new Filters.TypeFilter(type));
        return this;
    }

    /**
     * Gets items of given types (logical or)
     * I.e. get items of either 'Actor' or 'Movie' type
     * @param types Types to get
     */
    types(types: TClientTypes['contentTypeCodenames'][]): this {
        this.parameters.push(new Filters.TypeFilter(types));
        return this;
    }

    /**
     * Gets only item from given collection
     * @param collection Codename of collection to get
     */
    collection(collection: TClientTypes['collectionCodenames']): this {
        this.parameters.push(new Filters.CollectionFilter(collection));
        return this;
    }

    /**
     * Gets items from given collections (logical or)
     * I.e. get items of either 'default' or 'christmas-campaign' collection
     * @param collections Collections to get
     */
    collections(collections: TClientTypes['collectionCodenames'][]): this {
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
    languageParameter(languageCodename: TClientTypes['languageCodenames']): this {
        this.parameters.push(new Parameters.LanguageParameter(languageCodename));
        return this;
    }

    /**
     * Used to limit the number of elements returned by query.
     * @param elementCodenames Array of element codenames to fetch
     */
    elementsParameter(elementCodenames: TClientTypes['languageCodenames'][]): this {
        this.parameters.push(new Parameters.ElementsParameter(elementCodenames));
        return this;
    }

    /**
     * Used to exclude elements returned by query.
     * @param elementCodenames Array of element codenames to exclude
     */
    excludeElementsParameter(elementCodenames: TClientTypes['languageCodenames'][]): this {
        this.parameters.push(new Parameters.ExcludeElementsParameter(elementCodenames));
        return this;
    }

    toPromise(): Promise<
        IDeliveryNetworkResponse<
            Responses.IListContentItemsResponse<TContentItem, TClientTypes['contentItemType']>,
            Contracts.IListContentItemsContract
        >
    > {
        return this.queryService.getMultipleItems(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        const action = '/items';

        // handle default language
        this.processDefaultLanguageParameter();

        // handle archived items
        this.processExcludeArchivedItemsParameter();

        return super.resolveUrlInternal(action);
    }

    map(json: any): Responses.IListContentItemsResponse<TContentItem, TClientTypes['contentItemType']> {
        return this.queryService.mappingService.listContentItemsResponse(json);
    }

    protected allResponseFactory(
        items: any[],
        responses: IDeliveryNetworkResponse<
            Responses.IListContentItemsResponse<TContentItem, TClientTypes['contentItemType']>,
            Contracts.IListContentItemsContract
        >[]
    ): Responses.IListContentItemsAllResponse<TContentItem, TClientTypes['contentItemType']> {
        this.linkItems(items, responses);

        return {
            items: items,
            responses: responses
        };
    }

    private linkItems(
        items: IContentItem[],
        responses: IDeliveryNetworkResponse<
            Responses.IListContentItemsResponse<TContentItem, TClientTypes['contentItemType']>,
            Contracts.IListContentItemsContract
        >[]
    ): void {
        // prepare all available items (including components) for linking
        const allContentItems: IContentItem[] = [];

        // process linked items (modular_content part of the response)
        for (const response of responses) {
            allContentItems.push(...Object.values(response.data.linkedItems));
        }

        // add standard items
        for (const item of items) {
            if (!allContentItems.find((m) => m.system.codename.toLowerCase() === item.system.codename.toLowerCase())) {
                allContentItems.push(item);
            }
        }
        // process main items
        this.linkItemsInRte(allContentItems);
    }
}
