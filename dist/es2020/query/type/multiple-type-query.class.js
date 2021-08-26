import { Parameters } from '../../models';
import { BaseTypeQuery } from './base-type-query.class';
export class MultipleTypeQuery extends BaseTypeQuery {
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
        this.parameters.push(new Parameters.LimitParameter(limit));
        return this;
    }
    /**
     * Skips the selected number of types
     * @param skip Number of types to skip
     */
    skipParameter(skip) {
        this.parameters.push(new Parameters.SkipParameter(skip));
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
//# sourceMappingURL=multiple-type-query.class.js.map