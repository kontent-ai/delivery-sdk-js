

import { IDeliveryClientConfig } from '../../config';
import { ContentItem, ItemResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseItemsFeedQuery } from './base-items-feed-query.class';

export class ItemsFeedQueryAll<TItem extends ContentItem> extends BaseItemsFeedQuery<
    TItem,
    ItemResponses.ItemsFeedAllResponse<TItem>
> {
    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
    }

    /**
     * Gets the runnable Promise
     */
    toPromise(): Promise<ItemResponses.ItemsFeedAllResponse<TItem>> {
        return super.runItemsFeedQueryAll();
    }

    /**
     * Gets 'Url' representation of query
     */
    getUrl(): string {
        return super.getItemFeedQueryUrl();
    }
}
