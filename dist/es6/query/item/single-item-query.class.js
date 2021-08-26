import { Parameters } from '../../models';
import { BaseItemQuery } from './base-item-query.class';
export class SingleItemQuery extends BaseItemQuery {
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
        this.parameters.push(new Parameters.DepthParameter(depth));
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
//# sourceMappingURL=single-item-query.class.js.map