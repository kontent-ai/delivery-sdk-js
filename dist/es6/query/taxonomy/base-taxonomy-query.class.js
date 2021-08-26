import { BaseQuery } from '../common/base-query.class';
export class BaseTaxonomyQuery extends BaseQuery {
    constructor(config, queryService) {
        super(config, queryService);
        this.config = config;
        this.queryService = queryService;
        /**
         * Taxonomies endpoint URL action
         */
        this.taxonomiesEndpoint = 'taxonomies';
        /**
         * Query configuration
         */
        this._queryConfig = {};
    }
    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig) {
        this._queryConfig = queryConfig;
        return this;
    }
    /**
     * Gets headers used by this query
     */
    getHeaders() {
        return this.queryService.getHeaders(this._queryConfig);
    }
    getTaxonomyQueryUrl(taxonomyCodename) {
        const action = '/' + this.taxonomiesEndpoint + '/' + taxonomyCodename;
        return super.resolveUrlInternal(action);
    }
    getTaxonomiesQueryUrl() {
        const action = '/' + this.taxonomiesEndpoint;
        return super.resolveUrlInternal(action);
    }
    runTaxonomyQuery(codename) {
        return this.queryService.getTaxonomy(this.getTaxonomyQueryUrl(codename), this._queryConfig);
    }
    runTaxonomiesQuery() {
        return this.queryService.getTaxonomies(this.getTaxonomiesQueryUrl(), this._queryConfig);
    }
}
//# sourceMappingURL=base-taxonomy-query.class.js.map