import { IHeader, IQueryParameter } from '@kentico/kontent-core';
import { Observable } from 'rxjs';
import { IDeliveryClientConfig } from '../../config';
import { IKontentResponse, IQueryConfig } from '../../models';
import { QueryService } from '../../services';
export declare abstract class BaseQuery<TResponse extends IKontentResponse<any>> {
    protected config: IDeliveryClientConfig;
    protected queryService: QueryService;
    protected parameters: IQueryParameter[];
    protected customUrl?: string;
    protected abstract _queryConfig: IQueryConfig;
    constructor(config: IDeliveryClientConfig, queryService: QueryService);
    abstract getUrl(): string;
    abstract toObservable(): Observable<TResponse>;
    /**
     * Adds parameter to query
     * @param name Name of parameter
     * @param value Value of parameter
     */
    withParameter(name: string, value: string): this;
    /**
     * Adds parameters to query
     * @param parameters Array of parameters
     */
    withParameters(parameters: IQueryParameter[]): this;
    /**
     * Gets headers used by this query
     */
    getHeaders(): IHeader[];
    withUrl(url: string): this;
    getParameters(): IQueryParameter[];
    toPromise(): Promise<TResponse>;
    protected resolveUrlInternal(action: string): string;
}
