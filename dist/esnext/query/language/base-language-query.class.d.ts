import { IHeader } from '@kentico/kontent-core';
import { Observable } from 'rxjs';
import { IDeliveryClientConfig } from '../../config';
import { IKontentResponse, IKontentResponseDebug, ILanguagesQueryConfig, LanguageResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';
export declare abstract class BaseLanguageQuery<TResponse extends IKontentResponse<IKontentResponseDebug>> extends BaseQuery<TResponse> {
    protected config: IDeliveryClientConfig;
    protected queryService: QueryService;
    /**
     * Endpoint
     */
    protected readonly endpoint: string;
    /**
     * Query configuration
     */
    protected _queryConfig: ILanguagesQueryConfig;
    constructor(config: IDeliveryClientConfig, queryService: QueryService);
    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: ILanguagesQueryConfig): this;
    /**
     * Gets headers used by this query
     */
    getHeaders(): IHeader[];
    protected getLanguagesQueryUrl(): string;
    protected runLanguagesQuery(): Observable<LanguageResponses.ListLanguagesResponse>;
}
