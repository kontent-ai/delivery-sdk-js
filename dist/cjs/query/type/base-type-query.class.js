"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTypeQuery = void 0;
const base_query_class_1 = require("../common/base-query.class");
class BaseTypeQuery extends base_query_class_1.BaseQuery {
    constructor(config, queryService) {
        super(config, queryService);
        this.config = config;
        this.queryService = queryService;
        this.parameters = [];
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
    getSingleTypeQueryUrl(codename) {
        const action = '/types/' + codename;
        return super.resolveUrlInternal(action);
    }
    getMultipleTypesQueryUrl() {
        const action = '/types';
        return super.resolveUrlInternal(action);
    }
    runMultipleTypesQuery() {
        return this.queryService.getMultipleTypes(this.getMultipleTypesQueryUrl(), this._queryConfig);
    }
    runSingleTypeQuery(codename) {
        return this.queryService.getSingleType(this.getSingleTypeQueryUrl(codename), this._queryConfig);
    }
}
exports.BaseTypeQuery = BaseTypeQuery;
//# sourceMappingURL=base-type-query.class.js.map