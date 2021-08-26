import { BaseElementQuery } from './base-element-query.class';
export class ElementQuery extends BaseElementQuery {
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
//# sourceMappingURL=element-query.class.js.map