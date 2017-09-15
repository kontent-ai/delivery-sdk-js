// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// filters
import { Filters } from '../../models/common/filters';

// models
import { IQueryParameter } from '../../interfaces/common/iquery-parameter.interface';
import { TypeResponses } from '../../models/type/responses';
import { IItemQueryConfig } from '../../interfaces/item/iitem-query.config';
import { ItemQueryConfig } from '../../models/item/item-query.config';

// base query
import { BaseQuery } from '../common/base-query.class';

// models
import { IHeader } from '../../interfaces/common/iheader.interface';

// rxjs
import { Observable } from 'rxjs/Rx';

export abstract class BaseTypeQuery extends BaseQuery {

    protected parameters: IQueryParameter[] = [];
    protected _queryConfig: IItemQueryConfig = new ItemQueryConfig();

    constructor(
        protected config: DeliveryClientConfig,
    ) {
        super(config)
    }

    getHeaders(): IHeader[] {
        return super.getHeadersInternal(this._queryConfig);
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