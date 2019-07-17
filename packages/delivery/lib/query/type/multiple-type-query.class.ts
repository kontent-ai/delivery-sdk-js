import { Observable } from 'rxjs';

import { IDeliveryClientConfig } from '../../config';
import { Parameters, TypeResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseTypeQuery } from './base-type-query.class';

export class MultipleTypeQuery extends BaseTypeQuery<TypeResponses.ViewContentTypeResponse> {

    constructor(
        protected config: IDeliveryClientConfig,
        protected queryService: QueryService
    ) {
        super(config, queryService);
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
    toObservable(): Observable<TypeResponses.ViewContentTypeResponse> {
        return super.runMultipleTypesQuery();
    }

    /**
    * Gets 'Url' representation of query
    */
    getUrl(): string {
        return super.getMultipleTypesQueryUrl();
    }
}
