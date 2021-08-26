"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxonomyQuery = void 0;
const base_taxonomy_query_class_1 = require("./base-taxonomy-query.class");
class TaxonomyQuery extends base_taxonomy_query_class_1.BaseTaxonomyQuery {
    constructor(config, queryService, taxonomyCodename) {
        super(config, queryService);
        this.config = config;
        this.queryService = queryService;
        this.taxonomyCodename = taxonomyCodename;
        if (!taxonomyCodename) {
            throw Error(`Cannot create taxonomy query without codename of the taxonomy`);
        }
    }
    /**
    * Gets the runnable Observable
    */
    toObservable() {
        return super.runTaxonomyQuery(this.taxonomyCodename);
    }
    /**
    * Gets 'Url' representation of query
    */
    getUrl() {
        return super.getTaxonomyQueryUrl(this.taxonomyCodename);
    }
}
exports.TaxonomyQuery = TaxonomyQuery;
//# sourceMappingURL=taxonomy-query.class.js.map