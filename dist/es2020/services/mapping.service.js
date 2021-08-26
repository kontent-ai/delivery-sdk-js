import { GenericElementMapper, ItemMapper, LanguageMapper, TaxonomyMapper, TypeMapper } from '../mappers';
import { ElementResponses, ItemResponses, LanguageResponses, Pagination, TaxonomyResponses, TypeResponses } from '../models';
export class MappingService {
    constructor(config, richTextHtmlParser) {
        this.config = config;
        this.richTextHtmlParser = richTextHtmlParser;
        this.typeMapper = new TypeMapper();
        this.languageMapper = new LanguageMapper();
        this.itemMapper = new ItemMapper(config, richTextHtmlParser);
        this.taxonomyMapper = new TaxonomyMapper();
        this.genericElementMapper = new GenericElementMapper();
        this.isDeveloperMode = config.isDeveloperMode === true ? true : false;
    }
    /**
     * Gets response for list of languages
     * @param response Response data
     */
    listLanguagesResponse(response) {
        const languages = this.languageMapper.mapMultipleLanguages(response.data);
        const pagination = new Pagination({
            skip: response.data.pagination.skip,
            count: response.data.pagination.count,
            limit: response.data.pagination.limit,
            nextPage: response.data.pagination.next_page,
        });
        return new LanguageResponses.ListLanguagesResponse(languages, pagination, response, this.isDeveloperMode);
    }
    /**
     * Gets response for getting a multiple type
     * @param response Response data
     */
    listContentTypesResponse(response) {
        const types = this.typeMapper.mapMultipleTypes(response.data);
        const pagination = new Pagination({
            skip: response.data.pagination.skip,
            count: response.data.pagination.count,
            limit: response.data.pagination.limit,
            nextPage: response.data.pagination.next_page
        });
        return new TypeResponses.ListContentTypesResponse(types, pagination, response, this.isDeveloperMode);
    }
    /**
     * Gets response for single type
     * @param response Response data
     * @param options Options
     */
    viewContentTypeResponse(response) {
        const type = this.typeMapper.mapSingleType(response.data);
        return new TypeResponses.ViewContentTypeResponse(type, response, this.isDeveloperMode);
    }
    itemsFeedResponse(response, queryConfig) {
        const itemsResult = this.itemMapper.mapItems({
            linkedItems: Object.values(response.data.modular_content),
            mainItems: response.data.items,
            queryConfig: queryConfig
        });
        return new ItemResponses.ItemsFeedResponse(itemsResult.items, itemsResult.linkedItems, response, this.isDeveloperMode);
    }
    itemsFeedAllResponse(responses, queryConfig) {
        // join data from all responses before resolving items
        const allMainItems = [];
        let allLinkedItems = {};
        for (const response of responses) {
            allMainItems.push(...response.data.items);
            allLinkedItems = Object.assign(Object.assign({}, allLinkedItems), response.data.modular_content);
        }
        const itemsResult = this.itemMapper.mapItems({
            linkedItems: Object.values(allLinkedItems),
            mainItems: allMainItems,
            queryConfig: queryConfig
        });
        return new ItemResponses.ItemsFeedAllResponse(itemsResult.items, itemsResult.linkedItems, responses, this.isDeveloperMode);
    }
    /**
     * Gets response for getting single item
     * @param response Response data
     * @param queryConfig Query configuration
     */
    viewContentItemResponse(response, queryConfig) {
        const itemResult = this.itemMapper.mapSingleItemFromResponse(response.data, queryConfig);
        return new ItemResponses.ViewContentItemResponse(itemResult.item, itemResult.linkedItems, response, this.isDeveloperMode);
    }
    /**
     * Gets response for getting multiple items
     * @param response Response data
     * @param queryConfig Query configuration
     */
    listContentItemsResponse(response, queryConfig) {
        const itemsResult = this.itemMapper.mapMultipleItemsFromResponse(response.data, queryConfig);
        const pagination = new Pagination({
            skip: response.data.pagination.skip,
            count: response.data.pagination.count,
            limit: response.data.pagination.limit,
            nextPage: response.data.pagination.next_page,
            totalCount: response.data.pagination.total_count
        });
        return new ItemResponses.ListContentItemsResponse(itemsResult.items, pagination, itemsResult.linkedItems, response, this.isDeveloperMode);
    }
    /**
     * Gets response for getting single taxonomy item
     * @param response Response data
     */
    viewTaxonomyGroupResponse(response) {
        const taxonomy = this.taxonomyMapper.mapTaxonomy(response.data.system, response.data.terms);
        return new TaxonomyResponses.ViewTaxonomyGroupResponse(taxonomy, response, this.isDeveloperMode);
    }
    /**
     * Gets response for getting multiples taxonomies
     * @param response Response data
     */
    listTaxonomyGroupsResponse(response) {
        const taxonomies = this.taxonomyMapper.mapTaxonomies(response.data.taxonomies);
        const pagination = new Pagination({
            skip: response.data.pagination.skip,
            count: response.data.pagination.count,
            limit: response.data.pagination.limit,
            nextPage: response.data.pagination.next_page
        });
        return new TaxonomyResponses.ListTaxonomyGroupsResponse(taxonomies, pagination, response, this.isDeveloperMode);
    }
    /**
     * Gets response for getting single content type element
     * @param response Response data
     */
    viewContentTypeElementResponse(response) {
        const element = this.genericElementMapper.mapElement(response.data);
        return new ElementResponses.ViewContentTypeElementResponse(element, response, this.isDeveloperMode);
    }
}
//# sourceMappingURL=mapping.service.js.map