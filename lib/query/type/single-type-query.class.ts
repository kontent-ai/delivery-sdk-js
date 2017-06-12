// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// models
import { DeliveryTypeResponse } from '../../models/type/responses';

// query params
import * as Parameters from '../../models/common/parameters';

// base query
import { BaseTypeQuery } from './base-type-query.class';

// rxjs
import { Observable } from 'rxjs/Rx';

export class SingleTypeQuery extends BaseTypeQuery {

    constructor(
        protected config: DeliveryClientConfig,
        private typeCodename: string
    ) {
        super(config)
    }

    // execution

    get(): Observable<DeliveryTypeResponse> {
        return super.runSingleTypeQuery(this.typeCodename)
    }

    // debug

    toString(): string {
        return super.getSingleTypeQueryUrl(this.typeCodename);
    }
}