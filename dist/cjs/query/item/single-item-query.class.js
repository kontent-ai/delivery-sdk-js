"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleItemQuery = void 0;
const models_1 = require("../../models");
const base_item_query_class_1 = require("./base-item-query.class");
class SingleItemQuery extends base_item_query_class_1.BaseItemQuery {
    constructor(config, queryService, codename) {
        super(config, queryService);
        this.config = config;
        this.queryService = queryService;
        this.codename = codename;
        if (!codename) {
            throw Error(`'codename' has to be configured for 'SingleItemQuery' query`);
        }
    }
    /**
     * Indicates depth of query that affects loading of nested linked items.
     * @param depth Depth of the query (> 0)
     */
    depthParameter(depth) {
        this.parameters.push(new models_1.Parameters.DepthParameter(depth));
        return this;
    }
    /**
     * Gets the runnable Observable
     */
    toObservable() {
        return super.runSingleItemQuery(this.codename);
    }
    /**
     * Gets 'Url' representation of query
     */
    getUrl() {
        return super.getSingleItemQueryUrl(this.codename);
    }
}
exports.SingleItemQuery = SingleItemQuery;
//# sourceMappingURL=single-item-query.class.js.map