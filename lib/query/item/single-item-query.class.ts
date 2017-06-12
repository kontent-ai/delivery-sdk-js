// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// models
import { DeliveryItemResponse } from '../../models/item/responses';
import { IContentItem } from '../../interfaces/item/icontent-item.interface';

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
    }

    // query params

    elementsParameter(elementCodenames: string[]): this {
        this.parameters.push(new Parameters.ElementsParameter(elementCodenames));
        return this;
    }

    depthParameter(depth: number): this {
        this.parameters.push(new Parameters.DepthParameter(depth));
        return this;
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