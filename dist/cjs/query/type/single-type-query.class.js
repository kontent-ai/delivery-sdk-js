"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleTypeQuery = void 0;
const base_type_query_class_1 = require("./base-type-query.class");
class SingleTypeQuery extends base_type_query_class_1.BaseTypeQuery {
    constructor(config, queryService, typeCodename) {
        super(config, queryService);
        this.config = config;
        this.queryService = queryService;
        this.typeCodename = typeCodename;
        if (!typeCodename) {
            throw Error(`Cannot create type query without the codename of the type`);
        }
    }
    /**
    * Gets the runnable Observable
    */
    toObservable() {
        return super.runSingleTypeQuery(this.typeCodename);
    }
    /**
    * Gets 'Url' representation of query
    */
    getUrl() {
        return super.getSingleTypeQueryUrl(this.typeCodename);
    }
}
exports.SingleTypeQuery = SingleTypeQuery;
//# sourceMappingURL=single-type-query.class.js.map