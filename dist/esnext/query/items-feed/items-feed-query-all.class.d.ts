import { Observable } from 'rxjs';
import { IDeliveryClientConfig } from '../../config';
import { ContentItem, ItemResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseItemsFeedQuery } from './base-items-feed-query.class';
export declare class ItemsFeedQueryAll<TItem extends ContentItem> extends BaseItemsFeedQuery<TItem, ItemResponses.ItemsFeedAllResponse<TItem>> {
    protected config: IDeliveryClientConfig;
    protected queryService: QueryService;
    constructor(config: IDeliveryClientConfig, queryService: QueryService);
    /**
     * Gets the runnable Observable
     */
    toObservable(): Observable<ItemResponses.ItemsFeedAllResponse<TItem>>;
    /**
     * Gets 'Url' representation of query
     */
    getUrl(): string;
}
