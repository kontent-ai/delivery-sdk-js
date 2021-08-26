import { BaseTypeQuery } from './base-type-query.class';
export class SingleTypeQuery extends BaseTypeQuery {
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
//# sourceMappingURL=single-type-query.class.js.map