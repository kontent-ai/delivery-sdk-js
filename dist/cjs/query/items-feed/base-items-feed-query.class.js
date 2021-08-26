"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseItemsFeedQuery = void 0;
const models_1 = require("../../models");
const base_item_query_class_1 = require("../item/base-item-query.class");
class BaseItemsFeedQuery extends base_item_query_class_1.BaseItemQuery {
    constructor(config, queryService) {
        super(config, queryService);
        this.config = config;
        this.queryService = queryService;
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
     * Equals filter condition
     * @param element Element to filter. Example: 'elements.movie'
     * @param value Value to match. Example: 'Kingsman'
     */
    equalsFilter(element, value) {
        this.parameters.push(new models_1.Filters.EqualsFilter(element, value));
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
     * In filter
     * @param element Element to filter.
     * @param values Values
     */
    inFilter(element, values) {
        this.parameters.push(new models_1.Filters.InFilter(element, values));
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
}
exports.BaseItemsFeedQuery = BaseItemsFeedQuery;
//# sourceMappingURL=base-items-feed-query.class.js.map