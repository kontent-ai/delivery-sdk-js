import { Observable } from 'rxjs';
import { IDeliveryClientConfig } from '../../config';
import { ContentItem, ItemResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseItemQuery } from './base-item-query.class';
export declare class SingleItemQuery<TItem extends ContentItem> extends BaseItemQuery<TItem, ItemResponses.ViewContentItemResponse<TItem>> {
    protected config: IDeliveryClientConfig;
    protected queryService: QueryService;
    private codename;
    constructor(config: IDeliveryClientConfig, queryService: QueryService, codename: string);
    /**
     * Indicates depth of query that affects loading of nested linked items.
     * @param depth Depth of the query (> 0)
     */
    depthParameter(depth: number): this;
    /**
     * Gets the runnable Observable
     */
    toObservable(): Observable<ItemResponses.ViewContentItemResponse<TItem>>;
    /**
     * Gets 'Url' representation of query
     */
    getUrl(): string;
}
