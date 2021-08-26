import { Parameters, } from '../../models';
import { BaseQuery } from '../common/base-query.class';
export class BaseItemQuery extends BaseQuery {
    constructor(config, queryService) {
        super(config, queryService);
        this.config = config;
        this.queryService = queryService;
        this._queryConfig = {};
    }
    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig) {
        this._queryConfig = queryConfig;
        return this;
    }
    /**
     * Language codename
     * @param languageCodename Codename of the language
     */
    languageParameter(languageCodename) {
        this.parameters.push(new Parameters.LanguageParameter(languageCodename));
        return this;
    }
    /**
     * Used to limit the number of elements returned by query.
     * @param elementCodenames Array of element codenames to fetch
     */
    elementsParameter(elementCodenames) {
        this.parameters.push(new Parameters.ElementsParameter(elementCodenames));
        return this;
    }
    getItemFeedQueryUrl() {
        const action = '/items-feed';
        // add default language is necessry
        this.processDefaultLanguageParameter();
        return super.resolveUrlInternal(action);
    }
    getMultipleItemsQueryUrl() {
        const action = '/items';
        // add default language is necessry
        this.processDefaultLanguageParameter();
        return super.resolveUrlInternal(action);
    }
    getSingleItemQueryUrl(codename) {
        const action = '/items/' + codename;
        // add default language is necessry
        this.processDefaultLanguageParameter();
        return super.resolveUrlInternal(action);
    }
    runItemsFeedQuery() {
        const url = this.getItemFeedQueryUrl();
        return this.queryService.getItemsFeed(url, this._queryConfig);
    }
    runItemsFeedQueryAll() {
        const url = this.getItemFeedQueryUrl();
        return this.queryService.getItemsFeedAll(url, this._queryConfig);
    }
    runMultipleItemsQuery() {
        const url = this.getMultipleItemsQueryUrl();
        return this.queryService.getMultipleItems(url, this._queryConfig);
    }
    runSingleItemQuery(codename) {
        const url = this.getSingleItemQueryUrl(codename);
        return this.queryService.getSingleItem(url, this._queryConfig);
    }
    processDefaultLanguageParameter() {
        // add default language if none is specified && default language is specified globally
        if (this.config.defaultLanguage) {
            const languageParameter = this.getParameters().find(m => m.getParam() === 'language');
            if (!languageParameter) {
                // language parameter was not specified in query, use globally defined language
                this.parameters.push(new Parameters.LanguageParameter(this.config.defaultLanguage));
            }
        }
    }
}
//# sourceMappingURL=base-item-query.class.js.map