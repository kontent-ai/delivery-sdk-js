import { Parameters } from '../../models';
import { BaseLanguageQuery } from './base-language-query.class';
export class LanguagesQuery extends BaseLanguageQuery {
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
        this.parameters.push(new Parameters.LimitParameter(limit));
        return this;
    }
    /**
     * Skips the selected number of taxonomies
     * @param skip Number of taxonomies to skip
     */
    skipParameter(skip) {
        this.parameters.push(new Parameters.SkipParameter(skip));
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
//# sourceMappingURL=languages-query.class.js.map