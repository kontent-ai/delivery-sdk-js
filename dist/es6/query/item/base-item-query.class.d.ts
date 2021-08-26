import { Observable } from 'rxjs';
import { IDeliveryClientConfig } from '../../config';
import { ContentItem, IItemQueryConfig, IKontentResponse, IKontentResponseDebug, ItemResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';
export declare abstract class BaseItemQuery<TItem extends ContentItem, TResponse extends IKontentResponse<IKontentResponseDebug | IKontentResponseDebug[]>> extends BaseQuery<TResponse> {
    protected config: IDeliveryClientConfig;
    protected queryService: QueryService;
    protected _queryConfig: IItemQueryConfig;
    constructor(config: IDeliveryClientConfig, queryService: QueryService);
    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: IItemQueryConfig): this;
    /**
     * Language codename
     * @param languageCodename Codename of the language
     */
    languageParameter(languageCodename: string): this;
    /**
     * Used to limit the number of elements returned by query.
     * @param elementCodenames Array of element codenames to fetch
     */
    elementsParameter(elementCodenames: string[]): this;
    protected getItemFeedQueryUrl(): string;
    protected getMultipleItemsQueryUrl(): string;
    protected getSingleItemQueryUrl(codename: string): string;
    protected runItemsFeedQuery(): Observable<ItemResponses.ItemsFeedResponse<TItem>>;
    protected runItemsFeedQueryAll(): Observable<ItemResponses.ItemsFeedAllResponse<TItem>>;
    protected runMultipleItemsQuery(): Observable<ItemResponses.ListContentItemsResponse<TItem>>;
    protected runSingleItemQuery(codename: string): Observable<ItemResponses.ViewContentItemResponse<TItem>>;
    private processDefaultLanguageParameter;
}
