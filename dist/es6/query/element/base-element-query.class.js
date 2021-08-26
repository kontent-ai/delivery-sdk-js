import { BaseQuery } from '../common/base-query.class';
export class BaseElementQuery extends BaseQuery {
    constructor(config, queryService) {
        super(config, queryService);
        this.config = config;
        this.queryService = queryService;
        this._queryConfig = {};
    }
    /**
     * Use to configure query
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
    getElementQueryUrl(typeCodename, elementCodename) {
        const action = '/types/' + typeCodename + '/elements/' + elementCodename;
        return super.resolveUrlInternal(action);
    }
    runElementQuery(typeCodename, elementCodename) {
        return this.queryService.getElement(this.getElementQueryUrl(typeCodename, elementCodename), this._queryConfig);
    }
}
//# sourceMappingURL=base-element-query.class.js.map