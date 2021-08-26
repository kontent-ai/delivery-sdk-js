"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleTypeQuery = void 0;
const models_1 = require("../../models");
const base_type_query_class_1 = require("./base-type-query.class");
class MultipleTypeQuery extends base_type_query_class_1.BaseTypeQuery {
    constructor(config, queryService) {
        super(config, queryService);
        this.config = config;
        this.queryService = queryService;
    }
    /**
    * Limits the number of types returned by query
    * @param limit Number of types to load
    */
    limitParameter(limit) {
        this.parameters.push(new models_1.Parameters.LimitParameter(limit));
        return this;
    }
    /**
     * Skips the selected number of types
     * @param skip Number of types to skip
     */
    skipParameter(skip) {
        this.parameters.push(new models_1.Parameters.SkipParameter(skip));
        return this;
    }
    /**
    * Gets the runnable Observable
    */
    toObservable() {
        return super.runMultipleTypesQuery();
    }
    /**
    * Gets 'Url' representation of query
    */
    getUrl() {
        return super.getMultipleTypesQueryUrl();
    }
}
exports.MultipleTypeQuery = MultipleTypeQuery;
//# sourceMappingURL=multiple-type-query.class.js.map