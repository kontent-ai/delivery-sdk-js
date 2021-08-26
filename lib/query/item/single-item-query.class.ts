

import { IDeliveryClientConfig } from '../../config';
import { ContentItem, ItemResponses, Parameters } from '../../models';
import { QueryService } from '../../services';
import { BaseItemQuery } from './base-item-query.class';

export class SingleItemQuery<TItem extends ContentItem> extends BaseItemQuery<
    TItem,
    ItemResponses.ViewContentItemResponse<TItem>
> {
    constructor(
        protected config: IDeliveryClientConfig,
        protected queryService: QueryService,
        private codename: string
    ) {
        super(config, queryService);

        if (!codename) {
            throw Error(`'codename' has to be configured for 'SingleItemQuery' query`);
        }
    }

    /**
     * Indicates depth of query that affects loading of nested linked items.
     * @param depth Depth of the query (> 0)
     */
    depthParameter(depth: number): this {
        this.parameters.push(new Parameters.DepthParameter(depth));
        return this;
    }

    /**
     * Gets the runnable Promise
     */
    toPromise(): Promise<ItemResponses.ViewContentItemResponse<TItem>> {
        return super.runSingleItemQuery(this.codename);
    }

    /**
     * Gets 'Url' representation of query
     */
    getUrl(): string {
        return super.getSingleItemQueryUrl(this.codename);
    }
}
