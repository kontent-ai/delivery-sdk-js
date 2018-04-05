import { Observable } from 'rxjs';

import { IDeliveryClientConfig } from '../../config/delivery-client.config';
import { Parameters } from '../../models/common/parameters';
import { TaxonomyResponses } from '../../models/taxonomy/responses';
import { QueryService } from '../../services/query.service';
import { BaseTaxonomyQuery } from './base-taxonomy-query.class';

export class TaxonomiesQuery extends BaseTaxonomyQuery<TaxonomyResponses.TaxonomiesResponse> {

    constructor(
        protected config: IDeliveryClientConfig,
        protected queryService: QueryService
    ) {
        super(config, queryService);
    }

     /**
     * Limits the number of taxonomies returned by query
     * @param limit Number of taxonomies to load
     */
    limitParameter(limit: number): this {
        this.parameters.push(new Parameters.LimitParameter(limit));
        return this;
    }

     /**
     * Skips the selected number of taxonomies
     * @param skip Number of taxonomies to skip
     */
    skipParameter(skip: number): this {
        this.parameters.push(new Parameters.SkipParameter(skip));
        return this;
    }

     /**
     * Gets the runnable Observable
     */
    get(): Observable<TaxonomyResponses.TaxonomiesResponse> {
        return super.runTaxonomiesQuery();
    }

    // debug

     /**
     * Gets 'Url' representation of query
     */
    toString(): string {
        return super.getTaxonomiesQueryUrl();
    }
}
