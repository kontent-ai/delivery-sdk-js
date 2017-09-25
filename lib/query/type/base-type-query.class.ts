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

export abstract class BaseTypeQuery extends BaseQuery {

    protected parameters: IQueryParameter[] = [];
    protected _queryConfig: IContentTypeQueryConfig = new ContentTypeQueryConfig();

    constructor(
        protected config: DeliveryClientConfig,
    ) {
        super(config)
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
        return super.getHeaders(this._queryConfig);
    }

    protected getSingleTypeQueryUrl(codename: string): string {
        var action = '/types/' + codename;

        return this.getUrl(action, this._queryConfig, this.parameters);
    }

    protected getMultipleTypesQueryUrl(): string {
        var action = '/types';

        return this.getUrl(action, this._queryConfig, this.parameters);
    }

    protected runMultipleTypesQuery(): Observable<TypeResponses.DeliveryTypeListingResponse> {
        return super.getMultipleTypes(this.getMultipleTypesQueryUrl(), this._queryConfig);
    }

    protected runSingleTypeQuery(codename: string): Observable<TypeResponses.DeliveryTypeResponse> {
        return super.getSingleType(this.getSingleTypeQueryUrl(codename), this._queryConfig);
    }
}