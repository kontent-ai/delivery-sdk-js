import { Observable } from 'rxjs';

import { IDeliveryClientConfig } from '../../config';
import {
    ContentItem,
    IItemQueryConfig,
    IKontentResponse,
    IKontentResponseDebug,
    ItemResponses,
    Parameters,
} from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';

export abstract class BaseItemQuery<
    TItem extends ContentItem,
    TResponse extends IKontentResponse<IKontentResponseDebug | IKontentResponseDebug[]>
> extends BaseQuery<TResponse> {
    protected _queryConfig: IItemQueryConfig = {};

    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
    }

    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: IItemQueryConfig): this {
        this._queryConfig = queryConfig;
        return this;
    }

    /**
     * Language codename
     * @param languageCodename Codename of the language
     */
    languageParameter(languageCodename: string): this {
        this.parameters.push(new Parameters.LanguageParameter(languageCodename));
        return this;
    }

    /**
     * Used to limit the number of elements returned by query.
     * @param elementCodenames Array of element codenames to fetch
     */
    elementsParameter(elementCodenames: string[]): this {
        this.parameters.push(new Parameters.ElementsParameter(elementCodenames));
        return this;
    }

    protected getItemFeedQueryUrl(): string {
        const action = '/items-feed';

        // add default language is necessry
        this.processDefaultLanguageParameter();

        return super.resolveUrlInternal(action);
    }

    protected getMultipleItemsQueryUrl(): string {
        const action = '/items';

        // add default language is necessry
        this.processDefaultLanguageParameter();

        return super.resolveUrlInternal(action);
    }

    protected getSingleItemQueryUrl(codename: string): string {
        const action = '/items/' + codename;

        // add default language is necessry
        this.processDefaultLanguageParameter();

        return super.resolveUrlInternal(action);
    }

    protected runItemsFeedQuery(): Observable<ItemResponses.ItemsFeedResponse<TItem>> {
        const url = this.getItemFeedQueryUrl();

        return this.queryService.getItemsFeed(url, this._queryConfig);
    }

    protected runItemsFeedQueryAll(): Observable<ItemResponses.ItemsFeedAllResponse<TItem>> {
        const url = this.getItemFeedQueryUrl();

        return this.queryService.getItemsFeedAll(url, this._queryConfig);
    }

    protected runMultipleItemsQuery(): Observable<ItemResponses.ListContentItemsResponse<TItem>> {
        const url = this.getMultipleItemsQueryUrl();

        return this.queryService.getMultipleItems(url, this._queryConfig);
    }

    protected runSingleItemQuery(codename: string): Observable<ItemResponses.ViewContentItemResponse<TItem>> {
        const url = this.getSingleItemQueryUrl(codename);

        return this.queryService.getSingleItem(url, this._queryConfig);
    }

    private processDefaultLanguageParameter(): void {
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
