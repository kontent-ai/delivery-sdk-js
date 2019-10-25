import { IDeliveryClientConfig } from '../../config';
import { BaseKontentResponse, ContentItem, Filters, Parameters, SortOrder } from '../../models';
import { QueryService } from '../../services';
import { BaseItemQuery } from '../item/base-item-query.class';

export abstract class BaseItemsFeedQuery<
    TItem extends ContentItem,
    TResponse extends BaseKontentResponse<any>
> extends BaseItemQuery<TItem, TResponse> {
    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
    }

    /**
     * Gets only item of given type
     * @param type Codename of type to get
     */
    type(type: string): this {
        this.parameters.push(new Filters.TypeFilter(type));
        return this;
    }

    /**
     * Gets items of given types (logical or)
     * I.e. get items of either 'Actor' or 'Movie' type
     * @param types Types to get
     */
    types(types: string[]): this {
        this.parameters.push(new Filters.TypeFilter(types));
        return this;
    }

    /**
     * Equals filter condition
     * @param element Element to filter. Example: 'elements.movie'
     * @param value Value to match. Example: 'Kingsman'
     */
    equalsFilter(element: string, value: string): this {
        this.parameters.push(new Filters.EqualsFilter(element, value));
        return this;
    }

    /**
     * All filter
     * @param element Element to filter.
     * @param values Values
     */
    allFilter(element: string, values: string[]): this {
        this.parameters.push(new Filters.AllFilter(element, values));
        return this;
    }

    /**
     * Any filter
     * @param element Element to filter.
     * @param values Values
     */
    anyFilter(element: string, values: string[]): this {
        this.parameters.push(new Filters.AnyFilter(element, values));
        return this;
    }

    /**
     * Contains filter
     * @param element Element to filter.
     * @param values Values
     */
    containsFilter(element: string, values: string[]): this {
        this.parameters.push(new Filters.ContainsFilter(element, values));
        return this;
    }

    /**
     * Greater then filter
     * @param element Element to filter.
     * @param value Value
     */
    greaterThanFilter(element: string, value: string): this {
        this.parameters.push(new Filters.GreaterThanFilter(element, value));
        return this;
    }

    /**
     * Greater then or equals filter
     * @param element Element to filter.
     * @param value Value
     */
    greaterThanOrEqualFilter(element: string, value: string): this {
        this.parameters.push(new Filters.GreaterThanOrEqualFilter(element, value));
        return this;
    }

    /**
     * In filter
     * @param element Element to filter.
     * @param values Values
     */
    inFilter(element: string, values: string[]): this {
        this.parameters.push(new Filters.InFilter(element, values));
        return this;
    }

    /**
     * Less then filter
     * @param element Element to filter.
     * @param value Value
     */
    lessThanFilter(element: string, value: string): this {
        this.parameters.push(new Filters.LessThanFilter(element, value));
        return this;
    }

    /**
     * @param element Element to filter.
     * @param value Value
     */
    lessThanOrEqualFilter(element: string, value: string): this {
        this.parameters.push(new Filters.LessThanOrEqualFilter(element, value));
        return this;
    }

    /**
     * @param element Element to filter.
     * @param lowerValue Lower value of range (e.g. 2)
     * @param higherValue Higher value of range (e.g. 10)
     */
    rangeFilter(element: string, lowerValue: number, higherValue: number): this {
        this.parameters.push(new Filters.RangeFilter(element, lowerValue, higherValue));
        return this;
    }

    /**
     * Orders query based on given element and sort order
     * @param element Element by which to order
     * @param sortOrder Asc/Desc order type
     */
    orderParameter(element: string, sortOrder: SortOrder): this {
        this.parameters.push(new Parameters.OrderParameter(element, sortOrder));
        return this;
    }

    /**
     * Sets descending order on given element
     * @param element Element by which to order
     */
    orderByDescending(element: string): this {
        this.parameters.push(new Parameters.OrderParameter(element, SortOrder.desc));
        return this;
    }

    /**
     * Sets Ascending order on given element
     * @param element Element by which to order
     */
    orderByAscending(element: string): this {
        this.parameters.push(new Parameters.OrderParameter(element, SortOrder.asc));
        return this;
    }
}
