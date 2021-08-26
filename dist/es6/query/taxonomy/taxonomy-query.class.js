import { BaseTaxonomyQuery } from './base-taxonomy-query.class';
export class TaxonomyQuery extends BaseTaxonomyQuery {
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
//# sourceMappingURL=taxonomy-query.class.js.map