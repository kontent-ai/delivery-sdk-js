// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// filters
import { Filters } from '../../models/common/filters';

// models
import { IQueryParameter } from '../../interfaces/common/iquery-parameter.interface';
import { ElementResponses } from '../../models/element/responses';
import { IElementQueryConfig } from '../../interfaces/element/ielement-query.config';
import { ElementQueryConfig } from '../../models/element/element-query.config';

// base query
import { BaseQuery } from '../common/base-query.class';

// models
import { IHeader } from '../../interfaces/common/iheader.interface';

// rxjs
import { Observable } from 'rxjs/Rx';

export abstract class BaseElementQuery extends BaseQuery {

    protected parameters: IQueryParameter[] = [];
    protected _queryConfig: IElementQueryConfig = new ElementQueryConfig();

    constructor(
        protected config: DeliveryClientConfig,
    ) {
        super(config)
    }

    /**
     * Use to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: ElementQueryConfig): this {
        this._queryConfig = queryConfig;
        return this;
    }

    /**
     * Gets headers used by this query
     */
    getHeaders(): IHeader[] {
        return super.getHeaders(this._queryConfig);
    }

    protected getElementQueryUrl(typeCodename: string, elementCodename: string): string {
        if (!typeCodename) {
            throw Error(`Type codename has to be set in order to fetch content type element`);
        }

        if (!elementCodename) {
            throw Error(`Type element's codename has to be set in order to fetch content type element`);
        }

        var action = '/types/' + typeCodename + '/elements/' + elementCodename;

        return this.getUrl(action, this._queryConfig, this.parameters);
    }

    protected runElementQuery(typeCodename: string, elementCodename: string): Observable<ElementResponses.ElementResponse> {
        return super.getElement(this.getElementQueryUrl(typeCodename, elementCodename), this._queryConfig);
    }

}