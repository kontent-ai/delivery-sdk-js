// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// models
import { ItemResponses } from '../../models/item/responses';
import { IContentItem } from '../../interfaces/item/icontent-item.interface';
import { IHeader } from '../../interfaces/common/iheader.interface';

// services
import { BaseItemQuery } from './base-item-query.class';

// rxjs
import { Observable } from 'rxjs/Rx';

export class SingleItemQuery<TItem extends IContentItem> extends BaseItemQuery<TItem> {

    constructor(
        protected config: DeliveryClientConfig,
        private codename: string
    ) {
        super(config)

        if (!codename){
            throw Error(`'codename' has to be configured for 'SingleItemQuery' query`);
        }
    }

    // execution

    get(): Observable<ItemResponses.DeliveryItemResponse<TItem>> {
        return super.runSingleItemQuery(this.codename);
    }

    // debug

    toString(): string{
        return super.getSingleItemQueryUrl(this.codename);
    }
}