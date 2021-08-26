import { Observable } from 'rxjs';
import { IDeliveryClientConfig } from '../../config';
import { ContentItem, ItemResponses, SortOrder } from '../../models';
import { QueryService } from '../../services';
import { BaseItemQuery } from './base-item-query.class';
export declare class MultipleItemQuery<TItem extends ContentItem> extends BaseItemQuery<TItem, ItemResponses.ListContentItemsResponse<TItem>> {
    protected config: IDeliveryClientConfig;
    protected queryService: QueryService;
    constructor(config: IDeliveryClientConfig, queryService: QueryService);
    /**
     * Adds information about the total number of content items matching your query.
     * When set to true, the pagination object returned in the API response contains
     * an additional total_count property.
     */
    includeTotalCountParameter(): this;
    /**
     * Gets only item of given type
     * @param type Codename of type to get
     */
    type(type: string): this;
    /**
     * Gets items of given types (logical or)
     * I.e. get items of either 'Actor' or 'Movie' type
     * @param types Types to get
     */
    types(types: string[]): this;
    /**
     * Gets only item from given collection
     * @param collection Codename of collection to get
     */
    collection(collection: string): this;
    /**
     * Gets items from given collections (logical or)
     * I.e. get items of either 'default' or 'christmas-campaign' collection
     * @param collections Collections to get
     */
    collections(collections: string[]): this;
    /**
    * Empty filter condition
    * @param element Element with empty value
    */
    emptyFilter(element: string): this;
    /**
     * Not empty filter condition
     * @param element Element with non-empty value
     */
    notEmptyFilter(element: string): this;
    /**
     * Equals filter condition
     * @param element Element to filter. Example: 'elements.movie'
     * @param value Value to match. Example: 'Kingsman'
     */
    equalsFilter(element: string, value: string): this;
    /**
     * Not equals filter condition
     * @param element Element to filter. Example: 'elements.movie'
     * @param value Value to match. Example: 'Kingsman'
     */
    notEqualsFilter(element: string, value: string): this;
    /**
     * All filter
     * @param element Element to filter.
     * @param values Values
     */
    allFilter(element: string, values: string[]): this;
    /**
     * Any filter
     * @param element Element to filter.
     * @param values Values
     */
    anyFilter(element: string, values: string[]): this;
    /**
     * Contains filter
     * @param element Element to filter.
     * @param values Values
     */
    containsFilter(element: string, values: string[]): this;
    /**
     * Greater then filter
     * @param element Element to filter.
     * @param value Value
     */
    greaterThanFilter(element: string, value: string): this;
    /**
     * Greater then or equals filter
     * @param element Element to filter.
     * @param value Value
     */
    greaterThanOrEqualFilter(element: string, value: string): this;
    /**
     * Indicates depth of query that affects loading of nested linked items.
     * @param depth Depth of the query (> 0)
     */
    depthParameter(depth: number): this;
    /**
     * In filter
     * @param element Element to filter.
     * @param values Values
     */
    inFilter(element: string, values: string[]): this;
    /**
     * Not in filter
     * @param element Element to filter.
     * @param values Values
     */
    notInFilter(element: string, values: string[]): this;
    /**
     * Less then filter
     * @param element Element to filter.
     * @param value Value
     */
    lessThanFilter(element: string, value: string): this;
    /**
     * @param element Element to filter.
     * @param value Value
     */
    lessThanOrEqualFilter(element: string, value: string): this;
    /**
     * @param element Element to filter.
     * @param lowerValue Lower value of range (e.g. 2)
     * @param higherValue Higher value of range (e.g. 10)
     */
    rangeFilter(element: string, lowerValue: number, higherValue: number): this;
    /**
     * Limits the number of items returned by query
     * @param limit Number of items to load
     */
    limitParameter(limit: number): this;
    /**
     * Orders query based on given element and sort order
     * @param element Element by which to order
     * @param sortOrder Asc/Desc order type
     */
    orderParameter(element: string, sortOrder: SortOrder): this;
    /**
     * Sets descending order on given element
     * @param element Element by which to order
     */
    orderByDescending(element: string): this;
    /**
     * Sets Ascending order on given element
     * @param element Element by which to order
     */
    orderByAscending(element: string): this;
    /**
     * Skips the selected number of items
     * @param skip Number of items to skip
     */
    skipParameter(skip: number): this;
    /**
     * Gets the runnable Observable
     */
    toObservable(): Observable<ItemResponses.ListContentItemsResponse<TItem>>;
    /**
     * Gets 'Url' representation of query
     */
    getUrl(): string;
}
