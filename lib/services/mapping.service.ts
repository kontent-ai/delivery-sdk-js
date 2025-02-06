import { IDeliveryClientConfig } from '../config';
import { Contracts } from '../contracts';
import { SyncMapper, GenericElementMapper, ItemMapper, LanguageMapper, TaxonomyMapper, TypeMapper } from '../mappers';
import { Responses, IContentItem, IPagination, ClientTypes } from '../models';

export interface IMappingService<TClientTypes extends ClientTypes> {
    listContentTypesResponse(
        data: Contracts.IListContentTypeContract
    ): Responses.IListContentTypesResponse<TClientTypes['contentTypeCodenames']>;

    itemsFeedResponse<TContentItem extends IContentItem = TClientTypes['contentItemType']>(
        data: Contracts.IItemsFeedContract
    ): Responses.IListItemsFeedResponse<TContentItem, TClientTypes['contentItemType']>;

    viewContentTypeResponse(
        data: Contracts.IViewContentTypeContract
    ): Responses.IViewContentTypeResponse<TClientTypes['contentTypeCodenames']>;

    viewContentItemResponse<TContentItem extends IContentItem = TClientTypes['contentItemType']>(
        data: Contracts.IViewContentItemContract
    ): Responses.IViewContentItemResponse<TContentItem, TClientTypes['contentItemType']>;

    listContentItemsResponse<TContentItem extends IContentItem = TClientTypes['contentItemType']>(
        data: Contracts.IListContentItemsContract
    ): Responses.IListContentItemsResponse<TContentItem, TClientTypes['contentItemType']>;

    viewTaxonomyResponse(
        data: Contracts.IViewTaxonomyGroupContract
    ): Responses.IViewTaxonomyResponse<TClientTypes['taxonomyCodenames']>;

    listTaxonomiesResponse(
        data: Contracts.IListTaxonomyGroupsContract
    ): Responses.IListTaxonomiesResponse<TClientTypes['taxonomyCodenames']>;

    viewContentTypeElementResponse(
        data: Contracts.IViewContentTypeElementContract
    ): Responses.IViewContentTypeElementResponse;

    listLanguagesResponse(
        data: Contracts.IListLanguagesContract
    ): Responses.IListLanguagesResponse<TClientTypes['languageCodenames']>;
    initializeContentSync(data: Contracts.IInitializeSyncContract): Responses.IInitializeSyncResponse;
    syncChanges(data: Contracts.ISyncChangesContract): Responses.ISyncChangesResponse;
}

export class MappingService<TClientTypes extends ClientTypes> implements IMappingService<TClientTypes> {
    private readonly typeMapper: TypeMapper<TClientTypes>;
    private readonly languageMapper: LanguageMapper<TClientTypes>;
    private readonly itemMapper: ItemMapper<TClientTypes>;
    private readonly taxonomyMapper: TaxonomyMapper<TClientTypes>;
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
    listLanguagesResponse(
        data: Contracts.IListLanguagesContract
    ): Responses.IListLanguagesResponse<TClientTypes['languageCodenames']> {
        return {
            items: this.languageMapper.mapMultipleLanguages(data),
            pagination: this.mapPagination(data.pagination)
        };
    }

    /**
     * Gets response for getting a multiple type
     * @param data Response data
     */
    listContentTypesResponse(
        data: Contracts.IListContentTypeContract
    ): Responses.IListContentTypesResponse<TClientTypes['contentTypeCodenames']> {
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
    viewContentTypeResponse(
        data: Contracts.IViewContentTypeContract
    ): Responses.IViewContentTypeResponse<TClientTypes['contentTypeCodenames']> {
        return {
            type: this.typeMapper.mapSingleType(data)
        };
    }

    itemsFeedResponse<TContentItem extends IContentItem = TClientTypes['contentItemType']>(
        data: Contracts.IItemsFeedContract
    ): Responses.IListItemsFeedResponse<TContentItem, TClientTypes['contentItemType']> {
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
    viewContentItemResponse<TContentItem extends IContentItem = TClientTypes['contentItemType']>(
        data: Contracts.IViewContentItemContract
    ): Responses.IViewContentItemResponse<TContentItem, TClientTypes['contentItemType']> {
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
    listContentItemsResponse<TContentItem extends IContentItem = TClientTypes['contentItemType']>(
        data: Contracts.IListContentItemsContract
    ): Responses.IListContentItemsResponse<TContentItem, TClientTypes['contentItemType']> {
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
    viewTaxonomyResponse(
        data: Contracts.IViewTaxonomyGroupContract
    ): Responses.IViewTaxonomyResponse<TClientTypes['taxonomyCodenames']> {
        return {
            taxonomy: this.taxonomyMapper.mapTaxonomy(data.system, data.terms)
        };
    }

    /**
     * Gets response for getting multiples taxonomies
     * @param data Response data
     */
    listTaxonomiesResponse(
        data: Contracts.IListTaxonomyGroupsContract
    ): Responses.IListTaxonomiesResponse<TClientTypes['taxonomyCodenames']> {
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
        return this.genericElementMapper.mapElement(data);
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
