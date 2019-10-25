import { IHeader, IQueryParameter } from '@kentico/kontent-core';
import { Observable } from 'rxjs';

import { IDeliveryClientConfig } from '../../config';
import { IContentTypeQueryConfig, IKontentResponse, IKontentResponseDebug, TypeResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';

export abstract class BaseTypeQuery<TResponse extends IKontentResponse<IKontentResponseDebug>> extends BaseQuery<
    TResponse
> {
    protected parameters: IQueryParameter[] = [];
    protected _queryConfig: IContentTypeQueryConfig = {};

    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
    }

    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: IContentTypeQueryConfig): this {
        this._queryConfig = queryConfig;
        return this;
    }

    /**
     * Gets headers used by this query
     */
    getHeaders(): IHeader[] {
        return this.queryService.getHeaders(this._queryConfig);
    }

    protected getSingleTypeQueryUrl(codename: string): string {
        const action = '/types/' + codename;

        return super.resolveUrlInternal(action);
    }

    protected getMultipleTypesQueryUrl(): string {
        const action = '/types';

        return super.resolveUrlInternal(action);
    }

    protected runMultipleTypesQuery(): Observable<TypeResponses.ListContentTypesResponse> {
        return this.queryService.getMultipleTypes(this.getMultipleTypesQueryUrl(), this._queryConfig);
    }

    protected runSingleTypeQuery(codename: string): Observable<TypeResponses.ViewContentTypeResponse> {
        return this.queryService.getSingleType(this.getSingleTypeQueryUrl(codename), this._queryConfig);
    }
}
