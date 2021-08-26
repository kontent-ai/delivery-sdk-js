"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguagesQuery = void 0;
const models_1 = require("../../models");
const base_language_query_class_1 = require("./base-language-query.class");
class LanguagesQuery extends base_language_query_class_1.BaseLanguageQuery {
    constructor(config, queryService) {
        super(config, queryService);
        this.config = config;
        this.queryService = queryService;
    }
    /**
     * Limits the number of taxonomies returned by query
     * @param limit Number of taxonomies to load
     */
    limitParameter(limit) {
        this.parameters.push(new models_1.Parameters.LimitParameter(limit));
        return this;
    }
    /**
     * Skips the selected number of taxonomies
     * @param skip Number of taxonomies to skip
     */
    skipParameter(skip) {
        this.parameters.push(new models_1.Parameters.SkipParameter(skip));
        return this;
    }
    /**
     * Gets the Observable
     */
    toObservable() {
        return super.runLanguagesQuery();
    }
    /**
     * Gets 'Url' representation of query
     */
    getUrl() {
        return super.getLanguagesQueryUrl();
    }
}
exports.LanguagesQuery = LanguagesQuery;
//# sourceMappingURL=languages-query.class.js.map