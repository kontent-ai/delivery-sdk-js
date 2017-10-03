// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// models
import { ItemResponses } from '../../models/item/responses';
import { IContentItem } from '../../interfaces/item/icontent-item.interface';
import { SortOrder } from '../../models/common/sort-order.enum';

// filters
import { Filters } from '../../models/common/filters';

// query params
import { Parameters } from '../../models/common/parameters';

// base query
import { BaseItemQuery } from './base-item-query.class';

// rxjs
import { Observable } from 'rxjs/Rx';

export class MultipleItemQuery<TItem extends IContentItem> extends BaseItemQuery<TItem> {

    constructor(
        protected config: DeliveryClientConfig,
    ) {
        super(config)
    }

    // type

    /**
     * Gets only item of given type
     * @param type Codename of type to get
     */
    type(type: string): this {
        this._contentType = type;
        return this;
    }

    // filters

    /**
     * Equals filter condition
     * @param field Element to filter. Example: 'elements.movie'
     * @param value Value to match. Example: 'Kingsman'
     */
    equalsFilter(field: string, value: string): this {
        this.parameters.push(new Filters.EqualsFilter(field, value));
        return this;
    }

    /**
     * All filter
     * @param field Element to filter.
     * @param values Values
     */
    allFilter(field: string, values: string[]): this {
        this.parameters.push(new Filters.AllFilter(field, values));
        return this;
    }

    /**
     * Any filter
     * @param field Element to filter.
     * @param values Values
     */
    anyFilter(field: string, values: string[]): this {
        this.parameters.push(new Filters.AnyFilter(field, values));
        return this;
    }

    /**
     * Contains filter
     * @param field Element to filter.
     * @param values Values
     */
    containsFilter(field: string, values: string[]): this {
        this.parameters.push(new Filters.ContainsFilter(field, values));
        return this;
    }

    /**
     * Greater then filter
     * @param field Element to filter.
     * @param value Value
     */
    greaterThanFilter(field: string, value: string): this {
        this.parameters.push(new Filters.GreaterThanFilter(field, value));
        return this;
    }

    /**
     * Greater then or equals filter
     * @param field Element to filter.
     * @param value Value
     */
    greaterThanOrEqualFilter(field: string, value: string): this {
        this.parameters.push(new Filters.GreaterThanOrEqualFilter(field, value));
        return this;
    }

    /**
     * In filter
     * @param field Element to filter.
     * @param values Values
     */
    inFilter(field: string, values: string[]): this {
        this.parameters.push(new Filters.Infilter(field, values));
        return this;
    }

    /**
     * Less then filter
     * @param field Element to filter.
     * @param value Value
     */
    lessThanFilter(field: string, value: string): this {
        this.parameters.push(new Filters.LessThanFilter(field, value));
        return this;
    }

    /**
     * 
     * @param field Element to filter.
     * @param value 
     */
    lessThanOrEqualFilter(field: string, value: string): this {
        this.parameters.push(new Filters.LessThanOrEqualFilter(field, value));
        return this;
    }

    /**
     * 
     * @param field Element to filter.
     * @param lowerValue Lower value of range (e.g. 2)
     * @param higherValue Higher value of range (e.g. 10)
     */
    rangeFilter(field: string, lowerValue: number, higherValue: number): this {
        this.parameters.push(new Filters.RangeFilter(field, lowerValue, higherValue));
        return this;
    }

    /**
     * Limits the number of items returned by query
     * @param limit Number of items to load
     */
    limitParameter(limit: number): this {
        this.parameters.push(new Parameters.LimitParameter(limit));
        return this;
    }

    /**
     * Orders query based on given field and sort order
     * @param field Element by which to order
     * @param sortOrder Asc/Desc order type
     */
    orderParameter(field: string, sortOrder: SortOrder): this {
        this.parameters.push(new Parameters.OrderParameter(field, sortOrder));
        return this;
    }

    /**
     * Skips the selected number of items
     * @param skip Number of items to skip
     */
    skipParameter(skip: number): this {
        this.parameters.push(new Parameters.SkipParameter(skip));
        return this;
    }

    /**
     * Gets the runnable Observable
     */
    get(): Observable<ItemResponses.DeliveryItemListingResponse<TItem>> {
        return super.runMultipleItemsQuery();
    }

    /**
     * Gets 'Url' representation of query
     */
    toString(): string {
        return super.getMultipleItemsQueryUrl();
    }
}