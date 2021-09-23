import { IDeliveryClientConfig } from '../config';
import {
    ElementContracts,
    IPaginationContract,
    ItemContracts,
    LanguageContracts,
    TaxonomyContracts,
    TypeContracts
} from '../data-contracts';
import { GenericElementMapper, ItemMapper, LanguageMapper, TaxonomyMapper, TypeMapper } from '../mappers';
import {
    ElementResponses,
    IContentItem,
    IItemQueryConfig,
    ItemResponses,
    LanguageResponses,
    IPagination,
    TaxonomyResponses,
    TypeResponses
} from '../models';

export interface IMappingService {
    listContentTypesResponse(data: TypeContracts.IListContentTypeContract): TypeResponses.IListContentTypesResponse;

    itemsFeedResponse<TContentItem extends IContentItem = IContentItem>(
        data: ItemContracts.IItemsFeedContract,
        queryConfig: IItemQueryConfig
    ): ItemResponses.IListItemsFeedResponse<TContentItem>;

    viewContentTypeResponse(data: TypeContracts.IViewContentTypeContract): TypeResponses.IViewContentTypeResponse;

    viewContentItemResponse<TContentItem extends IContentItem = IContentItem>(
        data: ItemContracts.IViewContentItemContract,
        queryConfig: IItemQueryConfig
    ): ItemResponses.IViewContentItemResponse<TContentItem>;

    listContentItemsResponse<TContentItem extends IContentItem = IContentItem>(
        data: ItemContracts.IListContentItemsContract,
        queryConfig: IItemQueryConfig
    ): ItemResponses.IListContentItemsResponse<TContentItem>;

    viewTaxonomyGroupResponse(
        data: TaxonomyContracts.IViewTaxonomyGroupContract
    ): TaxonomyResponses.IViewTaxonomyResponse;

    listTaxonomyGroupsResponse(
        data: TaxonomyContracts.IListTaxonomyGroupsContract
    ): TaxonomyResponses.IListTaxonomiesResponse;

    viewContentTypeElementResponse(
        data: ElementContracts.IViewContentTypeElementContract
    ): ElementResponses.IViewContentTypeElementResponse;

    listLanguagesResponse(data: LanguageContracts.IListLanguagesContract): LanguageResponses.IListLanguagesResponse;
}

export class MappingService implements IMappingService {
    private readonly typeMapper: TypeMapper;
    private readonly languageMapper: LanguageMapper;
    private readonly itemMapper: ItemMapper;
    private readonly taxonomyMapper: TaxonomyMapper;
    private readonly genericElementMapper: GenericElementMapper;

    constructor(readonly config: IDeliveryClientConfig) {
        this.typeMapper = new TypeMapper();
        this.languageMapper = new LanguageMapper();
        this.itemMapper = new ItemMapper(config);
        this.taxonomyMapper = new TaxonomyMapper();
        this.genericElementMapper = new GenericElementMapper();
    }

    /**
     * Gets response for list of languages
     * @param data Response data
     */
    listLanguagesResponse(data: LanguageContracts.IListLanguagesContract): LanguageResponses.IListLanguagesResponse {
        return {
            items: this.languageMapper.mapMultipleLanguages(data),
            pagination: this.mapPagination(data.pagination)
        };
    }

    /**
     * Gets response for getting a multiple type
     * @param data Response data
     */
    listContentTypesResponse(data: TypeContracts.IListContentTypeContract): TypeResponses.IListContentTypesResponse {
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
    viewContentTypeResponse(data: TypeContracts.IViewContentTypeContract): TypeResponses.IViewContentTypeResponse {
        return {
            type: this.typeMapper.mapSingleType(data)
        };
    }

    itemsFeedResponse<TContentItem extends IContentItem = IContentItem>(
        data: ItemContracts.IItemsFeedContract,
        queryConfig: IItemQueryConfig
    ): ItemResponses.IListItemsFeedResponse<TContentItem> {
        const itemsResult = this.itemMapper.mapItems<TContentItem>({
            linkedItems: Object.values(data.modular_content),
            mainItems: data.items,
            queryConfig: queryConfig
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
        data: ItemContracts.IViewContentItemContract,
        queryConfig: IItemQueryConfig
    ): ItemResponses.IViewContentItemResponse<TContentItem> {
        const itemResult = this.itemMapper.mapSingleItemFromResponse<TContentItem>(data, queryConfig);

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
        data: ItemContracts.IListContentItemsContract,
        queryConfig: IItemQueryConfig
    ): ItemResponses.IListContentItemsResponse<TContentItem> {
        const itemsResult = this.itemMapper.mapMultipleItemsFromResponse<TContentItem>(data, queryConfig);

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
    viewTaxonomyGroupResponse(
        data: TaxonomyContracts.IViewTaxonomyGroupContract
    ): TaxonomyResponses.IViewTaxonomyResponse {
        return {
            taxonomy: this.taxonomyMapper.mapTaxonomy(data.system, data.terms)
        };
    }

    /**
     * Gets response for getting multiples taxonomies
     * @param data Response data
     */
    listTaxonomyGroupsResponse(
        data: TaxonomyContracts.IListTaxonomyGroupsContract
    ): TaxonomyResponses.IListTaxonomiesResponse {
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
        data: ElementContracts.IViewContentTypeElementContract
    ): ElementResponses.IViewContentTypeElementResponse {

        return {
            element: this.genericElementMapper.mapElement(data)
        };
    }

    private mapPagination(paginationContract: IPaginationContract): IPagination {
        return {
            skip: paginationContract.skip,
            count: paginationContract.count,
            limit: paginationContract.limit,
            nextPage: paginationContract.next_page,
            totalCount: paginationContract.total_count
        };
    }
}
