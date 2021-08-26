import { Filters, Parameters, SortOrder } from '../../models';
import { BaseItemQuery } from './base-item-query.class';
export class MultipleItemQuery extends BaseItemQuery {
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
        this.parameters.push(new Parameters.IncludeTotalCountParameter());
        return this;
    }
    /**
     * Gets only item of given type
     * @param type Codename of type to get
     */
    type(type) {
        this.parameters.push(new Filters.TypeFilter(type));
        return this;
    }
    /**
     * Gets items of given types (logical or)
     * I.e. get items of either 'Actor' or 'Movie' type
     * @param types Types to get
     */
    types(types) {
        this.parameters.push(new Filters.TypeFilter(types));
        return this;
    }
    /**
     * Gets only item from given collection
     * @param collection Codename of collection to get
     */
    collection(collection) {
        this.parameters.push(new Filters.CollectionFilter(collection));
        return this;
    }
    /**
     * Gets items from given collections (logical or)
     * I.e. get items of either 'default' or 'christmas-campaign' collection
     * @param collections Collections to get
     */
    collections(collections) {
        this.parameters.push(new Filters.CollectionFilter(collections));
        return this;
    }
    /**
    * Empty filter condition
    * @param element Element with empty value
    */
    emptyFilter(element) {
        this.parameters.push(new Filters.EmptyFilter(element));
        return this;
    }
    /**
     * Not empty filter condition
     * @param element Element with non-empty value
     */
    notEmptyFilter(element) {
        this.parameters.push(new Filters.NotEmptyFilter(element));
        return this;
    }
    /**
     * Equals filter condition
     * @param element Element to filter. Example: 'elements.movie'
     * @param value Value to match. Example: 'Kingsman'
     */
    equalsFilter(element, value) {
        this.parameters.push(new Filters.EqualsFilter(element, value));
        return this;
    }
    /**
     * Not equals filter condition
     * @param element Element to filter. Example: 'elements.movie'
     * @param value Value to match. Example: 'Kingsman'
     */
    notEqualsFilter(element, value) {
        this.parameters.push(new Filters.NotEqualsFilter(element, value));
        return this;
    }
    /**
     * All filter
     * @param element Element to filter.
     * @param values Values
     */
    allFilter(element, values) {
        this.parameters.push(new Filters.AllFilter(element, values));
        return this;
    }
    /**
     * Any filter
     * @param element Element to filter.
     * @param values Values
     */
    anyFilter(element, values) {
        this.parameters.push(new Filters.AnyFilter(element, values));
        return this;
    }
    /**
     * Contains filter
     * @param element Element to filter.
     * @param values Values
     */
    containsFilter(element, values) {
        this.parameters.push(new Filters.ContainsFilter(element, values));
        return this;
    }
    /**
     * Greater then filter
     * @param element Element to filter.
     * @param value Value
     */
    greaterThanFilter(element, value) {
        this.parameters.push(new Filters.GreaterThanFilter(element, value));
        return this;
    }
    /**
     * Greater then or equals filter
     * @param element Element to filter.
     * @param value Value
     */
    greaterThanOrEqualFilter(element, value) {
        this.parameters.push(new Filters.GreaterThanOrEqualFilter(element, value));
        return this;
    }
    /**
     * Indicates depth of query that affects loading of nested linked items.
     * @param depth Depth of the query (> 0)
     */
    depthParameter(depth) {
        this.parameters.push(new Parameters.DepthParameter(depth));
        return this;
    }
    /**
     * In filter
     * @param element Element to filter.
     * @param values Values
     */
    inFilter(element, values) {
        this.parameters.push(new Filters.InFilter(element, values));
        return this;
    }
    /**
     * Not in filter
     * @param element Element to filter.
     * @param values Values
     */
    notInFilter(element, values) {
        this.parameters.push(new Filters.NotInFilter(element, values));
        return this;
    }
    /**
     * Less then filter
     * @param element Element to filter.
     * @param value Value
     */
    lessThanFilter(element, value) {
        this.parameters.push(new Filters.LessThanFilter(element, value));
        return this;
    }
    /**
     * @param element Element to filter.
     * @param value Value
     */
    lessThanOrEqualFilter(element, value) {
        this.parameters.push(new Filters.LessThanOrEqualFilter(element, value));
        return this;
    }
    /**
     * @param element Element to filter.
     * @param lowerValue Lower value of range (e.g. 2)
     * @param higherValue Higher value of range (e.g. 10)
     */
    rangeFilter(element, lowerValue, higherValue) {
        this.parameters.push(new Filters.RangeFilter(element, lowerValue, higherValue));
        return this;
    }
    /**
     * Limits the number of items returned by query
     * @param limit Number of items to load
     */
    limitParameter(limit) {
        this.parameters.push(new Parameters.LimitParameter(limit));
        return this;
    }
    /**
     * Orders query based on given element and sort order
     * @param element Element by which to order
     * @param sortOrder Asc/Desc order type
     */
    orderParameter(element, sortOrder) {
        this.parameters.push(new Parameters.OrderParameter(element, sortOrder));
        return this;
    }
    /**
     * Sets descending order on given element
     * @param element Element by which to order
     */
    orderByDescending(element) {
        this.parameters.push(new Parameters.OrderParameter(element, SortOrder.desc));
        return this;
    }
    /**
     * Sets Ascending order on given element
     * @param element Element by which to order
     */
    orderByAscending(element) {
        this.parameters.push(new Parameters.OrderParameter(element, SortOrder.asc));
        return this;
    }
    /**
     * Skips the selected number of items
     * @param skip Number of items to skip
     */
    skipParameter(skip) {
        this.parameters.push(new Parameters.SkipParameter(skip));
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
//# sourceMappingURL=multiple-item-query.class.js.map