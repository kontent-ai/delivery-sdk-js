
// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// models
import { TaxonomyResponses } from '../../models/taxonomy/responses';

// base query
import { BaseTaxonomyQuery } from './base-taxonomy-query.class';

// query params
import { Parameters } from '../../models/common/parameters';

// rxjs
import { Observable } from 'rxjs/Rx';

// services
import { QueryService } from '../../services/query.service';

export class TaxonomiesQuery extends BaseTaxonomyQuery<TaxonomyResponses.TaxonomiesResponse> {

    constructor(
        protected config: DeliveryClientConfig,
        protected queryService: QueryService
    ) {
        super(config, queryService)
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
