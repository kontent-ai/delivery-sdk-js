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
import { Responses, IContentItem, IPagination } from '../models';

export interface IMappingService {
    listContentTypesResponse(data: TypeContracts.IListContentTypeContract): Responses.IListContentTypesResponse;

    itemsFeedResponse<TContentItem extends IContentItem = IContentItem>(
        data: ItemContracts.IItemsFeedContract
    ): Responses.IListItemsFeedResponse<TContentItem>;

    viewContentTypeResponse(data: TypeContracts.IViewContentTypeContract): Responses.IViewContentTypeResponse;

    viewContentItemResponse<TContentItem extends IContentItem = IContentItem>(
        data: ItemContracts.IViewContentItemContract
    ): Responses.IViewContentItemResponse<TContentItem>;

    listContentItemsResponse<TContentItem extends IContentItem = IContentItem>(
        data: ItemContracts.IListContentItemsContract
    ): Responses.IListContentItemsResponse<TContentItem>;

    viewTaxonomyResponse(data: TaxonomyContracts.IViewTaxonomyGroupContract): Responses.IViewTaxonomyResponse;

    listTaxonomiesResponse(data: TaxonomyContracts.IListTaxonomyGroupsContract): Responses.IListTaxonomiesResponse;

    viewContentTypeElementResponse(
        data: ElementContracts.IViewContentTypeElementContract
    ): Responses.IViewContentTypeElementResponse;

    listLanguagesResponse(data: LanguageContracts.IListLanguagesContract): Responses.IListLanguagesResponse;
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
    listLanguagesResponse(data: LanguageContracts.IListLanguagesContract): Responses.IListLanguagesResponse {
        return {
            items: this.languageMapper.mapMultipleLanguages(data),
            pagination: this.mapPagination(data.pagination)
        };
    }

    /**
     * Gets response for getting a multiple type
     * @param data Response data
     */
    listContentTypesResponse(data: TypeContracts.IListContentTypeContract): Responses.IListContentTypesResponse {
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
    viewContentTypeResponse(data: TypeContracts.IViewContentTypeContract): Responses.IViewContentTypeResponse {
        return {
            type: this.typeMapper.mapSingleType(data)
        };
    }

    itemsFeedResponse<TContentItem extends IContentItem = IContentItem>(
        data: ItemContracts.IItemsFeedContract
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
        data: ItemContracts.IViewContentItemContract
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
        data: ItemContracts.IListContentItemsContract
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
    viewTaxonomyResponse(data: TaxonomyContracts.IViewTaxonomyGroupContract): Responses.IViewTaxonomyResponse {
        return {
            taxonomy: this.taxonomyMapper.mapTaxonomy(data.system, data.terms)
        };
    }

    /**
     * Gets response for getting multiples taxonomies
     * @param data Response data
     */
    listTaxonomiesResponse(data: TaxonomyContracts.IListTaxonomyGroupsContract): Responses.IListTaxonomiesResponse {
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
    ): Responses.IViewContentTypeElementResponse {
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
