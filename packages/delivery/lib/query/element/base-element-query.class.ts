import { Observable } from 'rxjs';

import { IDeliveryClientConfig } from '../../config';
import { ICloudResponse, IElementQueryConfig } from '../../interfaces';
import { ElementResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';
import { IHeader } from 'kentico-cloud-core';

export abstract class BaseElementQuery<TResponse extends ICloudResponse> extends BaseQuery<TResponse> {

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

        return super.resolveUrlInternal(action);
    }

    protected runElementQuery(typeCodename: string, elementCodename: string): Observable<ElementResponses.ElementResponse> {
        return this.queryService.getElement(this.getElementQueryUrl(typeCodename, elementCodename), this._queryConfig);
    }
}
