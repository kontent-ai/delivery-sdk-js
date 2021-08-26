import { Observable } from 'rxjs';
import { IDeliveryClientConfig } from '../../config';
import { TaxonomyResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseTaxonomyQuery } from './base-taxonomy-query.class';
export declare class TaxonomiesQuery extends BaseTaxonomyQuery<TaxonomyResponses.ListTaxonomyGroupsResponse> {
    protected config: IDeliveryClientConfig;
    protected queryService: QueryService;
    constructor(config: IDeliveryClientConfig, queryService: QueryService);
    /**
    * Limits the number of taxonomies returned by query
    * @param limit Number of taxonomies to load
    */
    limitParameter(limit: number): this;
    /**
    * Skips the selected number of taxonomies
    * @param skip Number of taxonomies to skip
    */
    skipParameter(skip: number): this;
    /**
    * Gets the runnable Observable
    */
    toObservable(): Observable<TaxonomyResponses.ListTaxonomyGroupsResponse>;
    /**
    * Gets 'Url' representation of query
    */
    getUrl(): string;
}
