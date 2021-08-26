import { Observable } from 'rxjs';
import { IDeliveryClientConfig } from '../../config';
import { TaxonomyResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseTaxonomyQuery } from './base-taxonomy-query.class';
export declare class TaxonomyQuery extends BaseTaxonomyQuery<TaxonomyResponses.ViewTaxonomyGroupResponse> {
    protected config: IDeliveryClientConfig;
    protected queryService: QueryService;
    private taxonomyCodename;
    constructor(config: IDeliveryClientConfig, queryService: QueryService, taxonomyCodename: string);
    /**
    * Gets the runnable Observable
    */
    toObservable(): Observable<TaxonomyResponses.ViewTaxonomyGroupResponse>;
    /**
    * Gets 'Url' representation of query
    */
    getUrl(): string;
}
