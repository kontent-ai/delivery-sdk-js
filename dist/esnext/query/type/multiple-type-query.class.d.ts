import { Observable } from 'rxjs';
import { IDeliveryClientConfig } from '../../config';
import { TypeResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseTypeQuery } from './base-type-query.class';
export declare class MultipleTypeQuery extends BaseTypeQuery<TypeResponses.ListContentTypesResponse> {
    protected config: IDeliveryClientConfig;
    protected queryService: QueryService;
    constructor(config: IDeliveryClientConfig, queryService: QueryService);
    /**
    * Limits the number of types returned by query
    * @param limit Number of types to load
    */
    limitParameter(limit: number): this;
    /**
     * Skips the selected number of types
     * @param skip Number of types to skip
     */
    skipParameter(skip: number): this;
    /**
    * Gets the runnable Observable
    */
    toObservable(): Observable<TypeResponses.ListContentTypesResponse>;
    /**
    * Gets 'Url' representation of query
    */
    getUrl(): string;
}
