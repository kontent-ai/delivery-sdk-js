import { BaseQuery } from '../common/base-query.class';
export class BaseLanguageQuery extends BaseQuery {
    constructor(config, queryService) {
        super(config, queryService);
        this.config = config;
        this.queryService = queryService;
        /**
         * Endpoint
         */
        this.endpoint = 'languages';
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
    getLanguagesQueryUrl() {
        const action = '/' + this.endpoint;
        return super.resolveUrlInternal(action);
    }
    runLanguagesQuery() {
        return this.queryService.getLanguages(this.getLanguagesQueryUrl(), this._queryConfig);
    }
}
//# sourceMappingURL=base-language-query.class.js.map