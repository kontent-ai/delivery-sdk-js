"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsFeedQuery = void 0;
const base_items_feed_query_class_1 = require("./base-items-feed-query.class");
class ItemsFeedQuery extends base_items_feed_query_class_1.BaseItemsFeedQuery {
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
exports.ItemsFeedQuery = ItemsFeedQuery;
//# sourceMappingURL=items-feed-query.class.js.map