import { Parameters } from '../../models';
import { BaseTaxonomyQuery } from './base-taxonomy-query.class';
export class TaxonomiesQuery extends BaseTaxonomyQuery {
    constructor(config, queryService) {
        super(config, queryService);
        this.config = config;
        this.queryService = queryService;
    }
    /**
    * Limits the number of taxonomies returned by query
    * @param limit Number of taxonomies to load
    */
    limitParameter(limit) {
        this.parameters.push(new Parameters.LimitParameter(limit));
        return this;
    }
    /**
    * Skips the selected number of taxonomies
    * @param skip Number of taxonomies to skip
    */
    skipParameter(skip) {
        this.parameters.push(new Parameters.SkipParameter(skip));
        return this;
    }
    /**
    * Gets the runnable Observable
    */
    toObservable() {
        return super.runTaxonomiesQuery();
    }
    // debug
    /**
    * Gets 'Url' representation of query
    */
    getUrl() {
        return super.getTaxonomiesQueryUrl();
    }
}
//# sourceMappingURL=taxonomies-query.class.js.map