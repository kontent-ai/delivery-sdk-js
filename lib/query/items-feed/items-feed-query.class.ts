import { Observable } from 'rxjs';

import { IDeliveryClientConfig } from '../../config';
import { ContentItem, ItemResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseItemsFeedQuery } from './base-items-feed-query.class';

export class ItemsFeedQuery<TItem extends ContentItem> extends BaseItemsFeedQuery<
    TItem,
    ItemResponses.ItemsFeedResponse<TItem>
> {
    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
    }

    /**
     * Gets the runnable Observable
     */
    toObservable(): Observable<ItemResponses.ItemsFeedResponse<TItem>> {
        return super.runItemsFeedQuery();
    }

    /**
     * Gets 'Url' representation of query
     */
    getUrl(): string {
        return super.getItemFeedQueryUrl();
    }
}
