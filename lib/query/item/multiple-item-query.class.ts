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

    type(type: string): this {
        if (!type) {
            throw Error(`'type' cannot be null or empty`);
        }
        this._contentType = type;
        return this;
    }

    // filters

    equalsFilter(field: string, value: string): this {
        this.parameters.push(new Filters.EqualsFilter(field, value));
        return this;
    }

    allFilter(field: string, values: string[]): this {
        this.parameters.push(new Filters.AllFilter(field, values));
        return this;
    }

    anyFilter(field: string, values: string[]): this {
        this.parameters.push(new Filters.AnyFilter(field, values));
        return this;
    }

    containsFilter(field: string, values: string[]): this {
        this.parameters.push(new Filters.ContainsFilter(field, values));
        return this;
    }

    greaterThanFilter(field: string, value: string): this {
        this.parameters.push(new Filters.GreaterThanFilter(field, value));
        return this;
    }

    greaterThanOrEqualFilter(field: string, value: string): this {
        this.parameters.push(new Filters.GreaterThanOrEqualFilter(field, value));
        return this;
    }

    inFilter(field: string, values: string[]): this {
        this.parameters.push(new Filters.Infilter(field, values));
        return this;
    }

    lessThanFilter(field: string, value: string): this {
        this.parameters.push(new Filters.LessThanFilter(field, value));
        return this;
    }

    lessThanOrEqualFilter(field: string, value: string): this {
        this.parameters.push(new Filters.LessThanOrEqualFilter(field, value));
        return this;
    }

    rangeFilter(field: string, lowerValue: number, higherValue: number): this {
        this.parameters.push(new Filters.RangeFilter(field, lowerValue, higherValue));
        return this;
    }

    // query params

    limitParameter(limit: number): this {
        this.parameters.push(new Parameters.LimitParameter(limit));
        return this;
    }

    orderParameter(field: string, sortOrder: SortOrder): this {
        this.parameters.push(new Parameters.OrderParameter(field, sortOrder));
        return this;
    }

    skipParameter(skip: number): this {
        this.parameters.push(new Parameters.SkipParameter(skip));
        return this;
    }

    // execution

    get(): Observable<ItemResponses.DeliveryItemListingResponse<TItem>> {
        return super.runMultipleItemsQuery();
    }

    // debug

    toString(): string {
        return super.getMultipleItemsQueryUrl();
    }
}