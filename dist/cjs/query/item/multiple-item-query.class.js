"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleItemQuery = void 0;
const models_1 = require("../../models");
const base_item_query_class_1 = require("./base-item-query.class");
class MultipleItemQuery extends base_item_query_class_1.BaseItemQuery {
    constructor(config, queryService) {
        super(config, queryService);
        this.config = config;
        this.queryService = queryService;
    }
    /**
     * Adds information about the total number of content items matching your query.
     * When set to true, the pagination object returned in the API response contains
     * an additional total_count property.
     */
    includeTotalCountParameter() {
        this.parameters.push(new models_1.Parameters.IncludeTotalCountParameter());
        return this;
    }
    /**
     * Gets only item of given type
     * @param type Codename of type to get
     */
    type(type) {
        this.parameters.push(new models_1.Filters.TypeFilter(type));
        return this;
    }
    /**
     * Gets items of given types (logical or)
     * I.e. get items of either 'Actor' or 'Movie' type
     * @param types Types to get
     */
    types(types) {
        this.parameters.push(new models_1.Filters.TypeFilter(types));
        return this;
    }
    /**
     * Gets only item from given collection
     * @param collection Codename of collection to get
     */
    collection(collection) {
        this.parameters.push(new models_1.Filters.CollectionFilter(collection));
        return this;
    }
    /**
     * Gets items from given collections (logical or)
     * I.e. get items of either 'default' or 'christmas-campaign' collection
     * @param collections Collections to get
     */
    collections(collections) {
        this.parameters.push(new models_1.Filters.CollectionFilter(collections));
        return this;
    }
    /**
    * Empty filter condition
    * @param element Element with empty value
    */
    emptyFilter(element) {
        this.parameters.push(new models_1.Filters.EmptyFilter(element));
        return this;
    }
    /**
     * Not empty filter condition
     * @param element Element with non-empty value
     */
    notEmptyFilter(element) {
        this.parameters.push(new models_1.Filters.NotEmptyFilter(element));
        return this;
    }
    /**
     * Equals filter condition
     * @param element Element to filter. Example: 'elements.movie'
     * @param value Value to match. Example: 'Kingsman'
     */
    equalsFilter(element, value) {
        this.parameters.push(new models_1.Filters.EqualsFilter(element, value));
        return this;
    }
    /**
     * Not equals filter condition
     * @param element Element to filter. Example: 'elements.movie'
     * @param value Value to match. Example: 'Kingsman'
     */
    notEqualsFilter(element, value) {
        this.parameters.push(new models_1.Filters.NotEqualsFilter(element, value));
        return this;
    }
    /**
     * All filter
     * @param element Element to filter.
     * @param values Values
     */
    allFilter(element, values) {
        this.parameters.push(new models_1.Filters.AllFilter(element, values));
        return this;
    }
    /**
     * Any filter
     * @param element Element to filter.
     * @param values Values
     */
    anyFilter(element, values) {
        this.parameters.push(new models_1.Filters.AnyFilter(element, values));
        return this;
    }
    /**
     * Contains filter
     * @param element Element to filter.
     * @param values Values
     */
    containsFilter(element, values) {
        this.parameters.push(new models_1.Filters.ContainsFilter(element, values));
        return this;
    }
    /**
     * Greater then filter
     * @param element Element to filter.
     * @param value Value
     */
    greaterThanFilter(element, value) {
        this.parameters.push(new models_1.Filters.GreaterThanFilter(element, value));
        return this;
    }
    /**
     * Greater then or equals filter
     * @param element Element to filter.
     * @param value Value
     */
    greaterThanOrEqualFilter(element, value) {
        this.parameters.push(new models_1.Filters.GreaterThanOrEqualFilter(element, value));
        return this;
    }
    /**
     * Indicates depth of query that affects loading of nested linked items.
     * @param depth Depth of the query (> 0)
     */
    depthParameter(depth) {
        this.parameters.push(new models_1.Parameters.DepthParameter(depth));
        return this;
    }
    /**
     * In filter
     * @param element Element to filter.
     * @param values Values
     */
    inFilter(element, values) {
        this.parameters.push(new models_1.Filters.InFilter(element, values));
        return this;
    }
    /**
     * Not in filter
     * @param element Element to filter.
     * @param values Values
     */
    notInFilter(element, values) {
        this.parameters.push(new models_1.Filters.NotInFilter(element, values));
        return this;
    }
    /**
     * Less then filter
     * @param element Element to filter.
     * @param value Value
     */
    lessThanFilter(element, value) {
        this.parameters.push(new models_1.Filters.LessThanFilter(element, value));
        return this;
    }
    /**
     * @param element Element to filter.
     * @param value Value
     */
    lessThanOrEqualFilter(element, value) {
        this.parameters.push(new models_1.Filters.LessThanOrEqualFilter(element, value));
        return this;
    }
    /**
     * @param element Element to filter.
     * @param lowerValue Lower value of range (e.g. 2)
     * @param higherValue Higher value of range (e.g. 10)
     */
    rangeFilter(element, lowerValue, higherValue) {
        this.parameters.push(new models_1.Filters.RangeFilter(element, lowerValue, higherValue));
        return this;
    }
    /**
     * Limits the number of items returned by query
     * @param limit Number of items to load
     */
    limitParameter(limit) {
        this.parameters.push(new models_1.Parameters.LimitParameter(limit));
        return this;
    }
    /**
     * Orders query based on given element and sort order
     * @param element Element by which to order
     * @param sortOrder Asc/Desc order type
     */
    orderParameter(element, sortOrder) {
        this.parameters.push(new models_1.Parameters.OrderParameter(element, sortOrder));
        return this;
    }
    /**
     * Sets descending order on given element
     * @param element Element by which to order
     */
    orderByDescending(element) {
        this.parameters.push(new models_1.Parameters.OrderParameter(element, models_1.SortOrder.desc));
        return this;
    }
    /**
     * Sets Ascending order on given element
     * @param element Element by which to order
     */
    orderByAscending(element) {
        this.parameters.push(new models_1.Parameters.OrderParameter(element, models_1.SortOrder.asc));
        return this;
    }
    /**
     * Skips the selected number of items
     * @param skip Number of items to skip
     */
    skipParameter(skip) {
        this.parameters.push(new models_1.Parameters.SkipParameter(skip));
        return this;
    }
    /**
     * Gets the runnable Observable
     */
    toObservable() {
        return super.runMultipleItemsQuery();
    }
    /**
     * Gets 'Url' representation of query
     */
    getUrl() {
        return super.getMultipleItemsQueryUrl();
    }
}
exports.MultipleItemQuery = MultipleItemQuery;
//# sourceMappingURL=multiple-item-query.class.js.map