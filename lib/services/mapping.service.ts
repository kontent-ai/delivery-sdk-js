import { IDeliveryClientConfig } from '../config';
import { Contracts } from '../contracts';
import { SyncMapper, GenericElementMapper, ItemMapper, LanguageMapper, TaxonomyMapper, TypeMapper } from '../mappers';
import { Responses, IContentItem, IPagination } from '../models';

export interface IMappingService {
    listContentTypesResponse(data: Contracts.IListContentTypeContract): Responses.IListContentTypesResponse;

    itemsFeedResponse<TContentItem extends IContentItem = IContentItem>(
        data: Contracts.IItemsFeedContract
    ): Responses.IListItemsFeedResponse<TContentItem>;

    viewContentTypeResponse(data: Contracts.IViewContentTypeContract): Responses.IViewContentTypeResponse;

    viewContentItemResponse<TContentItem extends IContentItem = IContentItem>(
        data: Contracts.IViewContentItemContract
    ): Responses.IViewContentItemResponse<TContentItem>;

    listContentItemsResponse<TContentItem extends IContentItem = IContentItem>(
        data: Contracts.IListContentItemsContract
    ): Responses.IListContentItemsResponse<TContentItem>;

    viewTaxonomyResponse(data: Contracts.IViewTaxonomyGroupContract): Responses.IViewTaxonomyResponse;

    listTaxonomiesResponse(data: Contracts.IListTaxonomyGroupsContract): Responses.IListTaxonomiesResponse;

    viewContentTypeElementResponse(
        data: Contracts.IViewContentTypeElementContract
    ): Responses.IViewContentTypeElementResponse;

    listLanguagesResponse(data: Contracts.IListLanguagesContract): Responses.IListLanguagesResponse;
    initializeContentSync(data: Contracts.IInitializeSyncContract): Responses.IInitializeSyncResponse;
    syncChanges(data: Contracts.ISyncChangesContract): Responses.ISyncChangesResponse;
}

export class MappingService implements IMappingService {
    private readonly typeMapper: TypeMapper;
    private readonly languageMapper: LanguageMapper;
    private readonly itemMapper: ItemMapper;
    private readonly taxonomyMapper: TaxonomyMapper;
    private readonly genericElementMapper: GenericElementMapper;
    private readonly syncMapper: SyncMapper;

    constructor(readonly config: IDeliveryClientConfig) {
        this.typeMapper = new TypeMapper();
        this.languageMapper = new LanguageMapper();
        this.itemMapper = new ItemMapper(config);
        this.taxonomyMapper = new TaxonomyMapper();
        this.genericElementMapper = new GenericElementMapper();
        this.syncMapper = new SyncMapper();
    }

    /**
     * Gets response for list of languages
     * @param data Response data
     */
    listLanguagesResponse(data: Contracts.IListLanguagesContract): Responses.IListLanguagesResponse {
        return {
            items: this.languageMapper.mapMultipleLanguages(data),
            pagination: this.mapPagination(data.pagination)
        };
    }

    /**
     * Gets response for getting a multiple type
     * @param data Response data
     */
    listContentTypesResponse(data: Contracts.IListContentTypeContract): Responses.IListContentTypesResponse {
        return {
            items: this.typeMapper.mapMultipleTypes(data),
            pagination: this.mapPagination(data.pagination)
        };
    }

    /**
     * Gets response for single type
     * @param data Response data
     * @param options Options
     */
    viewContentTypeResponse(data: Contracts.IViewContentTypeContract): Responses.IViewContentTypeResponse {
        return {
            type: this.typeMapper.mapSingleType(data)
        };
    }

    itemsFeedResponse<TContentItem extends IContentItem = IContentItem>(
        data: Contracts.IItemsFeedContract
    ): Responses.IListItemsFeedResponse<TContentItem> {
        const itemsResult = this.itemMapper.mapItems<TContentItem>({
            linkedItems: Object.values(data.modular_content),
            mainItems: data.items
        });

        return {
            items: itemsResult.items,
            linkedItems: itemsResult.linkedItems
        };
    }

    /**
     * Gets response for getting single item
     * @param data Response data
     * @param queryConfig Query configuration
     */
    viewContentItemResponse<TContentItem extends IContentItem = IContentItem>(
        data: Contracts.IViewContentItemContract
    ): Responses.IViewContentItemResponse<TContentItem> {
        const itemResult = this.itemMapper.mapSingleItemFromResponse<TContentItem>(data);

        return {
            item: itemResult.item,
            linkedItems: itemResult.linkedItems
        };
    }

    /**
     * Gets response for getting multiple items
     * @param data Response data
     * @param queryConfig Query configuration
     */
    listContentItemsResponse<TContentItem extends IContentItem = IContentItem>(
        data: Contracts.IListContentItemsContract
    ): Responses.IListContentItemsResponse<TContentItem> {
        const itemsResult = this.itemMapper.mapMultipleItemsFromResponse<TContentItem>(data);

        return {
            items: itemsResult.items,
            pagination: this.mapPagination(data.pagination),
            linkedItems: itemsResult.linkedItems
        };
    }

    /**
     * Gets response for getting single taxonomy item
     * @param data Response data
     */
    viewTaxonomyResponse(data: Contracts.IViewTaxonomyGroupContract): Responses.IViewTaxonomyResponse {
        return {
            taxonomy: this.taxonomyMapper.mapTaxonomy(data.system, data.terms)
        };
    }

    /**
     * Gets response for getting multiples taxonomies
     * @param data Response data
     */
    listTaxonomiesResponse(data: Contracts.IListTaxonomyGroupsContract): Responses.IListTaxonomiesResponse {
        return {
            items: this.taxonomyMapper.mapTaxonomies(data.taxonomies),
            pagination: this.mapPagination(data.pagination)
        };
    }

    /**
     * Gets response for getting single content type element
     * @param data Response data
     */
    viewContentTypeElementResponse(
        data: Contracts.IViewContentTypeElementContract
    ): Responses.IViewContentTypeElementResponse {
        return {
            element: this.genericElementMapper.mapElement(data)
        };
    }

    initializeContentSync(data: Contracts.IInitializeSyncContract): Responses.IInitializeSyncResponse {
        return {
            items: data.items.map((m) => this.syncMapper.mapContentItemDelta(m))
        };
    }

    syncChanges(data: Contracts.ISyncChangesContract): Responses.ISyncChangesResponse {
        return {
            items: data.items.map((m) => this.syncMapper.mapContentItemDelta(m))
        };
    }

    private mapPagination(paginationContract: Contracts.IPaginationContract): IPagination {
        return {
            skip: paginationContract.skip,
            count: paginationContract.count,
            limit: paginationContract.limit,
            nextPage: paginationContract.next_page,
            totalCount: paginationContract.total_count ?? null
        };
    }
}
