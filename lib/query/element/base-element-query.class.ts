import { Observable } from 'rxjs';

import { IDeliveryClientConfig } from '../../config/delivery-client.config';
import { IHeader } from '../../interfaces/common/iheader.interface';
import { IElementQueryConfig } from '../../interfaces/element/ielement-query.config';
import { ElementResponses } from '../../models/element/responses';
import { QueryService } from '../../services/query.service';
import { BaseQuery } from '../common/base-query.class';

export abstract class BaseElementQuery<TResponse> extends BaseQuery<TResponse> {

    protected _queryConfig: IElementQueryConfig = {};

    constructor(
        protected config: IDeliveryClientConfig,
        protected queryService: QueryService
    ) {
        super(config, queryService);
    }

    /**
     * Use to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: IElementQueryConfig): this {
        this._queryConfig = queryConfig;
        return this;
    }

    /**
     * Gets headers used by this query
     */
    getHeaders(): IHeader[] {
        return this.queryService.getHeaders(this._queryConfig);
    }

    protected getElementQueryUrl(typeCodename: string, elementCodename: string): string {
        const action = '/types/' + typeCodename + '/elements/' + elementCodename;

        return this.queryService.getUrl(action, this._queryConfig, super.getParameters());
    }

    protected runElementQuery(typeCodename: string, elementCodename: string): Observable<ElementResponses.ElementResponse> {
        return this.queryService.getElement(this.getElementQueryUrl(typeCodename, elementCodename), this._queryConfig);
    }
}
