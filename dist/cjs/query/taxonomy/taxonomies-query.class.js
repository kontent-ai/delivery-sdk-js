"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxonomiesQuery = void 0;
const models_1 = require("../../models");
const base_taxonomy_query_class_1 = require("./base-taxonomy-query.class");
class TaxonomiesQuery extends base_taxonomy_query_class_1.BaseTaxonomyQuery {
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
        this.parameters.push(new models_1.Parameters.LimitParameter(limit));
        return this;
    }
    /**
    * Skips the selected number of taxonomies
    * @param skip Number of taxonomies to skip
    */
    skipParameter(skip) {
        this.parameters.push(new models_1.Parameters.SkipParameter(skip));
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
exports.TaxonomiesQuery = TaxonomiesQuery;
//# sourceMappingURL=taxonomies-query.class.js.map