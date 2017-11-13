
// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// models
import { TypeResponses } from '../../models/type/responses';

// query params
import { Parameters } from '../../models/common/parameters';

// base query
import { BaseTypeQuery } from './base-type-query.class';

// rxjs
import { Observable } from 'rxjs/Rx';

// services
import { QueryService } from '../../services/query.service';

export class MultipleTypeQuery extends BaseTypeQuery {

    constructor(
        protected config: DeliveryClientConfig,
        protected queryService: QueryService
    ) {
        super(config, queryService)
    }

     /**
     * Limits the number of types returned by query
     * @param limit Number of types to load
     */
    limitParameter(limit: number): this {
        this.parameters.push(new Parameters.LimitParameter(limit));
        return this;
    }

    /**
     * Skips the selected number of types
     * @param skip Number of types to skip
     */
    skipParameter(skip: number): this {
        this.parameters.push(new Parameters.SkipParameter(skip));
        return this;
    }

     /**
     * Gets the runnable Observable
     */
    get(): Observable<TypeResponses.DeliveryTypeListingResponse> {
        return super.runMultipleTypesQuery();
    }

     /**
     * Gets 'Url' representation of query
     */
    toString(): string {
        return super.getMultipleTypesQueryUrl();
    }
}
