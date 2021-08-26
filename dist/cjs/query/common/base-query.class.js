"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseQuery = void 0;
const models_1 = require("../../models");
class BaseQuery {
    constructor(config, queryService) {
        this.config = config;
        this.queryService = queryService;
        this.parameters = [];
    }
    /**
     * Adds parameter to query
     * @param name Name of parameter
     * @param value Value of parameter
     */
    withParameter(name, value) {
        this.parameters.push(new models_1.Parameters.QueryParameter(name, value));
        return this;
    }
    /**
     * Adds parameters to query
     * @param parameters Array of parameters
     */
    withParameters(parameters) {
        this.parameters.push(...parameters);
        return this;
    }
    /**
     * Gets headers used by this query
     */
    getHeaders() {
        return this.queryService.getHeaders(this._queryConfig);
    }
    withUrl(url) {
        this.customUrl = url;
        return this;
    }
    getParameters() {
        return this.parameters;
    }
    toPromise() {
        return this.toObservable().toPromise();
    }
    resolveUrlInternal(action) {
        // use custom URL if user specified it
        if (this.customUrl) {
            return this.customUrl;
        }
        // use original url
        return this.queryService.getUrl(action, this._queryConfig, this.getParameters());
    }
}
exports.BaseQuery = BaseQuery;
//# sourceMappingURL=base-query.class.js.map