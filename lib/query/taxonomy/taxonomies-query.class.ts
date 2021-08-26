

import { IDeliveryClientConfig } from '../../config';
import { Parameters, TaxonomyResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseTaxonomyQuery } from './base-taxonomy-query.class';

export class TaxonomiesQuery extends BaseTaxonomyQuery<TaxonomyResponses.ListTaxonomyGroupsResponse> {

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
    * Gets the runnable Promise
    */
    toPromise(): Promise<TaxonomyResponses.ListTaxonomyGroupsResponse> {
        return super.runTaxonomiesQuery();
    }

    // debug

    /**
    * Gets 'Url' representation of query
    */
    getUrl(): string {
        return super.getTaxonomiesQueryUrl();
    }
}
