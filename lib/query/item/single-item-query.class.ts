// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// models
import { DeliveryItemResponse } from '../../models/item/responses';
import { IContentItem } from '../../interfaces/item/icontent-item.interface';
import { IHeader } from '../../interfaces/common/iheader.interface';

// query params
import * as Parameters from '../../models/common/parameters';

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

    get(): Observable<DeliveryItemResponse<TItem>> {
        return super.runSingleItemQuery(this.codename);
    }

    // debug

    toString(): string{
        return super.getSingleItemQueryUrl(this.codename);
    }
}