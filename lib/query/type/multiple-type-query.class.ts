
// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// models
import { DeliveryTypeListingResponse } from '../../models/type/responses';

// query params
import * as Parameters from '../../models/common/parameters';

// base query
import { BaseTypeQuery } from './base-type-query.class';

// rxjs
import { Observable } from 'rxjs/Rx';

export class MultipleTypeQuery extends BaseTypeQuery {

    constructor(
        protected config: DeliveryClientConfig,
    ) {
        super(config)
    }

    // query params
    limitParameter(limit: number): this {
        this.parameters.push(new Parameters.LimitParameter(limit));
        return this;
    }

    skipParameter(skip: number): this {
        this.parameters.push(new Parameters.SkipParameter(skip));
        return this;
    }

    // execution

    get(): Observable<DeliveryTypeListingResponse> {
        return super.runMultipleTypesQuery();
    }

    // debug

    toString(): string {
        return super.getMultipleTypesQueryUrl();
    }
}