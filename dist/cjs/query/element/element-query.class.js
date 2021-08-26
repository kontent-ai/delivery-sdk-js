"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementQuery = void 0;
const base_element_query_class_1 = require("./base-element-query.class");
class ElementQuery extends base_element_query_class_1.BaseElementQuery {
    constructor(config, queryService, typeCodename, elementCodename) {
        super(config, queryService);
        this.config = config;
        this.queryService = queryService;
        this.typeCodename = typeCodename;
        this.elementCodename = elementCodename;
        if (!typeCodename) {
            throw Error(`Codename of the type has to be provided`);
        }
        if (!elementCodename) {
            throw Error(`Codename of the element has to be provided`);
        }
    }
    /**
    * Gets the runnable Observable
    */
    toObservable() {
        return super.runElementQuery(this.typeCodename, this.elementCodename);
    }
    /**
    * Gets 'Url' representation of query
    */
    getUrl() {
        return super.getElementQueryUrl(this.typeCodename, this.elementCodename);
    }
}
exports.ElementQuery = ElementQuery;
//# sourceMappingURL=element-query.class.js.map