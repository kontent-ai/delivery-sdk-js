import { Observable } from 'rxjs';

import { DeliveryClientConfig } from '../../config/delivery-client.config';
import { Parameters } from '../../models/common/parameters';
import { TypeResponses } from '../../models/type/responses';
import { QueryService } from '../../services/query.service';
import { BaseTypeQuery } from './base-type-query.class';

export class MultipleTypeQuery extends BaseTypeQuery<TypeResponses.DeliveryTypeListingResponse> {

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
