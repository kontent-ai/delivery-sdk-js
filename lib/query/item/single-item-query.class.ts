import { Observable } from 'rxjs';

import { IDeliveryClientConfig } from '../../config';
import { ContentItem, ItemResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseItemQuery } from './base-item-query.class';

export class SingleItemQuery<TItem extends ContentItem> extends BaseItemQuery<TItem, ItemResponses.DeliveryItemResponse<TItem>> {

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
    * Gets the runnable Observable
    */
    getObservable(): Observable<ItemResponses.DeliveryItemResponse<TItem>> {
        return super.runSingleItemQuery(this.codename);
    }

    /**
    * Gets 'Url' representation of query
    */
    getUrl(): string {
        return super.getSingleItemQueryUrl(this.codename);
    }
}
