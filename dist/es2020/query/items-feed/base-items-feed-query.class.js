import { Filters, Parameters, SortOrder } from '../../models';
import { BaseItemQuery } from '../item/base-item-query.class';
export class BaseItemsFeedQuery extends BaseItemQuery {
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
     * Equals filter condition
     * @param element Element to filter. Example: 'elements.movie'
     * @param value Value to match. Example: 'Kingsman'
     */
    equalsFilter(element, value) {
        this.parameters.push(new Filters.EqualsFilter(element, value));
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
     * In filter
     * @param element Element to filter.
     * @param values Values
     */
    inFilter(element, values) {
        this.parameters.push(new Filters.InFilter(element, values));
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
}
//# sourceMappingURL=base-items-feed-query.class.js.map