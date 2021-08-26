import { BaseItemsFeedQuery } from './base-items-feed-query.class';
export class ItemsFeedQuery extends BaseItemsFeedQuery {
    constructor(config, queryService) {
        super(config, queryService);
        this.config = config;
        this.queryService = queryService;
    }
    /**
     * Gets the runnable Observable
     */
    toObservable() {
        return super.runItemsFeedQuery();
    }
    /**
     * Gets 'Url' representation of query
     */
    getUrl() {
        return super.getItemFeedQueryUrl();
    }
}
//# sourceMappingURL=items-feed-query.class.js.map