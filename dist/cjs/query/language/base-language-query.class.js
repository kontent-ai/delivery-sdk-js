"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseLanguageQuery = void 0;
const base_query_class_1 = require("../common/base-query.class");
class BaseLanguageQuery extends base_query_class_1.BaseQuery {
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
exports.BaseLanguageQuery = BaseLanguageQuery;
//# sourceMappingURL=base-language-query.class.js.map