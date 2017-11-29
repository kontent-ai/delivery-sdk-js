// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// filters
import { Filters } from '../../models/common/filters';

// models
import { IQueryParameter } from '../../interfaces/common/iquery-parameter.interface';
import { TypeResponses } from '../../models/type/responses';
import { IContentTypeQueryConfig } from '../../interfaces/type/icontent-type-query.config';
import { ContentTypeQueryConfig } from '../../models/type/content-type-query.config';

// base query
import { BaseQuery } from '../common/base-query.class';

// models
import { IHeader } from '../../interfaces/common/iheader.interface';

// rxjs
import { Observable } from 'rxjs/Rx';

// services
import { QueryService } from '../../services/query.service';

export abstract class BaseTypeQuery<TResponse> extends BaseQuery<TResponse> {

    protected parameters: IQueryParameter[] = [];
    protected _queryConfig: IContentTypeQueryConfig = new ContentTypeQueryConfig();

    constructor(
        protected config: DeliveryClientConfig,
        protected queryService: QueryService
    ) {
        super(config, queryService)
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

        return this.queryService.getUrl(action, this._queryConfig, this.parameters);
    }

    protected getMultipleTypesQueryUrl(): string {
        const action = '/types';

        return this.queryService.getUrl(action, this._queryConfig, this.parameters);
    }

    protected runMultipleTypesQuery(): Observable<TypeResponses.DeliveryTypeListingResponse> {
        return this.queryService.getMultipleTypes(this.getMultipleTypesQueryUrl(), this._queryConfig);
    }

    protected runSingleTypeQuery(codename: string): Observable<TypeResponses.DeliveryTypeResponse> {
        return this.queryService.getSingleType(this.getSingleTypeQueryUrl(codename), this._queryConfig);
    }
}
