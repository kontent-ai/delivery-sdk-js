import { IDeliveryClientConfig } from '../config';
import {
    ElementContracts,
    ItemContracts,
    LanguageContracts,
    TaxonomyContracts,
    TypeContracts
} from '../data-contracts';
import { GenericElementMapper, ItemMapper, LanguageMapper, TaxonomyMapper, TypeMapper } from '../mappers';
import {
    ElementResponses,
    IContentItemElements,
    IItemQueryConfig,
    ItemResponses,
    LanguageResponses,
    Pagination,
    TaxonomyResponses,
    TypeResponses
} from '../models';
import { IRichTextHtmlParser } from '../parser';

export interface IMappingService {
    listContentTypesResponse(data: TypeContracts.IListContentTypeContract): TypeResponses.ListContentTypesResponse;

    itemsFeedResponse<TElements extends IContentItemElements>(
        data: ItemContracts.IItemsFeedContract,
        queryConfig: IItemQueryConfig
    ): ItemResponses.ListItemsFeedResponse<TElements>;

    viewContentTypeResponse(data: TypeContracts.IViewContentTypeContract): TypeResponses.ViewContentTypeResponse;

    viewContentItemResponse<TElements extends IContentItemElements>(
        data: ItemContracts.IViewContentItemContract,
        queryConfig: IItemQueryConfig
    ): ItemResponses.ViewContentItemResponse<TElements>;

    listContentItemsResponse<TElements extends IContentItemElements>(
        data: ItemContracts.IListContentItemsContract,
        queryConfig: IItemQueryConfig
    ): ItemResponses.ListContentItemsResponse<TElements>;

    viewTaxonomyGroupResponse(
        data: TaxonomyContracts.IViewTaxonomyGroupContract
    ): TaxonomyResponses.ViewTaxonomyResponse;

    listTaxonomyGroupsResponse(
        data: TaxonomyContracts.IListTaxonomyGroupsContract
    ): TaxonomyResponses.ListTaxonomiesResponse;

    viewContentTypeElementResponse(
        data: ElementContracts.IViewContentTypeElementContract
    ): ElementResponses.ViewContentTypeElementResponse;

    listLanguagesResponse(data: LanguageContracts.IListLanguagesContract): LanguageResponses.ListLanguagesResponse;
}

export class MappingService implements IMappingService {
    private readonly typeMapper: TypeMapper;
    private readonly languageMapper: LanguageMapper;
    private readonly itemMapper: ItemMapper;
    private readonly taxonomyMapper: TaxonomyMapper;
    private readonly genericElementMapper: GenericElementMapper;

    constructor(readonly config: IDeliveryClientConfig, readonly richTextHtmlParser: IRichTextHtmlParser) {
        this.typeMapper = new TypeMapper();
        this.languageMapper = new LanguageMapper();
        this.itemMapper = new ItemMapper(config, richTextHtmlParser);
        this.taxonomyMapper = new TaxonomyMapper();
        this.genericElementMapper = new GenericElementMapper();
    }

    /**
     * Gets response for list of languages
     * @param data Response data
     */
    listLanguagesResponse(data: LanguageContracts.IListLanguagesContract): LanguageResponses.ListLanguagesResponse {
        const languages = this.languageMapper.mapMultipleLanguages(data);

        const pagination: Pagination = new Pagination({
            skip: data.pagination.skip,
            count: data.pagination.count,
            limit: data.pagination.limit,
            nextPage: data.pagination.next_page
        });

        return new LanguageResponses.ListLanguagesResponse(languages, pagination);
    }

    /**
     * Gets response for getting a multiple type
     * @param data Response data
     */
    listContentTypesResponse(data: TypeContracts.IListContentTypeContract): TypeResponses.ListContentTypesResponse {
        const types = this.typeMapper.mapMultipleTypes(data);

        const pagination: Pagination = new Pagination({
            skip: data.pagination.skip,
            count: data.pagination.count,
            limit: data.pagination.limit,
            nextPage: data.pagination.next_page
        });

        return new TypeResponses.ListContentTypesResponse(types, pagination);
    }

    /**
     * Gets response for single type
     * @param data Response data
     * @param options Options
     */
    viewContentTypeResponse(data: TypeContracts.IViewContentTypeContract): TypeResponses.ViewContentTypeResponse {
        const type = this.typeMapper.mapSingleType(data);

        return new TypeResponses.ViewContentTypeResponse(type);
    }

    itemsFeedResponse<TElements extends IContentItemElements>(
        data: ItemContracts.IItemsFeedContract,
        queryConfig: IItemQueryConfig
    ): ItemResponses.ListItemsFeedResponse<TElements> {
        const itemsResult = this.itemMapper.mapItems<TElements>({
            linkedItems: Object.values(data.modular_content),
            mainItems: data.items,
            queryConfig: queryConfig
        });

        return new ItemResponses.ListItemsFeedResponse(itemsResult.items, itemsResult.linkedItems);
    }

    /**
     * Gets response for getting single item
     * @param data Response data
     * @param queryConfig Query configuration
     */
    viewContentItemResponse<TElements extends IContentItemElements>(
        data: ItemContracts.IViewContentItemContract,
        queryConfig: IItemQueryConfig
    ): ItemResponses.ViewContentItemResponse<TElements> {
        const itemResult = this.itemMapper.mapSingleItemFromResponse<TElements>(data, queryConfig);

        return new ItemResponses.ViewContentItemResponse<TElements>(itemResult.item, itemResult.linkedItems);
    }

    /**
     * Gets response for getting multiple items
     * @param data Response data
     * @param queryConfig Query configuration
     */
    listContentItemsResponse<TElements extends IContentItemElements>(
        data: ItemContracts.IListContentItemsContract,
        queryConfig: IItemQueryConfig
    ): ItemResponses.ListContentItemsResponse<TElements> {
        const itemsResult = this.itemMapper.mapMultipleItemsFromResponse<TElements>(data, queryConfig);
        const pagination: Pagination = new Pagination({
            skip: data.pagination.skip,
            count: data.pagination.count,
            limit: data.pagination.limit,
            nextPage: data.pagination.next_page,
            totalCount: data.pagination.total_count
        });

        return new ItemResponses.ListContentItemsResponse<TElements>(
            itemsResult.items,
            pagination,
            itemsResult.linkedItems
        );
    }

    /**
     * Gets response for getting single taxonomy item
     * @param data Response data
     */
    viewTaxonomyGroupResponse(
        data: TaxonomyContracts.IViewTaxonomyGroupContract
    ): TaxonomyResponses.ViewTaxonomyResponse {
        const taxonomy = this.taxonomyMapper.mapTaxonomy(data.system, data.terms);

        return new TaxonomyResponses.ViewTaxonomyResponse(taxonomy);
    }

    /**
     * Gets response for getting multiples taxonomies
     * @param data Response data
     */
    listTaxonomyGroupsResponse(
        data: TaxonomyContracts.IListTaxonomyGroupsContract
    ): TaxonomyResponses.ListTaxonomiesResponse {
        const taxonomies = this.taxonomyMapper.mapTaxonomies(data.taxonomies);

        const pagination: Pagination = new Pagination({
            skip: data.pagination.skip,
            count: data.pagination.count,
            limit: data.pagination.limit,
            nextPage: data.pagination.next_page
        });

        return new TaxonomyResponses.ListTaxonomiesResponse(taxonomies, pagination);
    }

    /**
     * Gets response for getting single content type element
     * @param data Response data
     */
    viewContentTypeElementResponse(
        data: ElementContracts.IViewContentTypeElementContract
    ): ElementResponses.ViewContentTypeElementResponse {
        const element = this.genericElementMapper.mapElement(data);

        return new ElementResponses.ViewContentTypeElementResponse(element);
    }
}
