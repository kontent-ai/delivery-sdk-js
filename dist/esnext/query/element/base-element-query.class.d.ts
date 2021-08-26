import { IHeader } from '@kentico/kontent-core';
import { Observable } from 'rxjs';
import { IDeliveryClientConfig } from '../../config';
import { ElementResponses, IElementQueryConfig, IKontentResponse, IKontentResponseDebug } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';
export declare abstract class BaseElementQuery<TResponse extends IKontentResponse<IKontentResponseDebug>> extends BaseQuery<TResponse> {
    protected config: IDeliveryClientConfig;
    protected queryService: QueryService;
    protected _queryConfig: IElementQueryConfig;
    constructor(config: IDeliveryClientConfig, queryService: QueryService);
    /**
     * Use to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: IElementQueryConfig): this;
    /**
     * Gets headers used by this query
     */
    getHeaders(): IHeader[];
    protected getElementQueryUrl(typeCodename: string, elementCodename: string): string;
    protected runElementQuery(typeCodename: string, elementCodename: string): Observable<ElementResponses.ViewContentTypeElementResponse>;
}
