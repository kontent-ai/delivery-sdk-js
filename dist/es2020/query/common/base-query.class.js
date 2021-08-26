import { Parameters } from '../../models';
export class BaseQuery {
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
        this.parameters.push(new Parameters.QueryParameter(name, value));
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
//# sourceMappingURL=base-query.class.js.map