import { IHeader, IQueryParameter } from '@kentico/kontent-core';
import { Observable } from 'rxjs';
import { IDeliveryClientConfig } from '../../config';
import { IContentTypeQueryConfig, IKontentResponse, IKontentResponseDebug, TypeResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';
export declare abstract class BaseTypeQuery<TResponse extends IKontentResponse<IKontentResponseDebug>> extends BaseQuery<TResponse> {
    protected config: IDeliveryClientConfig;
    protected queryService: QueryService;
    protected parameters: IQueryParameter[];
    protected _queryConfig: IContentTypeQueryConfig;
    constructor(config: IDeliveryClientConfig, queryService: QueryService);
    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: IContentTypeQueryConfig): this;
    /**
     * Gets headers used by this query
     */
    getHeaders(): IHeader[];
    protected getSingleTypeQueryUrl(codename: string): string;
    protected getMultipleTypesQueryUrl(): string;
    protected runMultipleTypesQuery(): Observable<TypeResponses.ListContentTypesResponse>;
    protected runSingleTypeQuery(codename: string): Observable<TypeResponses.ViewContentTypeResponse>;
}
