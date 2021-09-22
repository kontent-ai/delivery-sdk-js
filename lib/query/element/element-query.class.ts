import { IDeliveryClientConfig } from '../../config';
import { ElementResponses, IElementQueryConfig, IKontentNetworkResponse } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';

export class ElementQuery extends BaseQuery<ElementResponses.IViewContentTypeElementResponse, IElementQueryConfig> {
    constructor(
        protected config: IDeliveryClientConfig,
        protected queryService: QueryService,
        private typeCodename: string,
        private elementCodename: string
    ) {
        super(config, queryService);

        if (!typeCodename) {
            throw Error(`Codename of the type has to be provided`);
        }

        if (!elementCodename) {
            throw Error(`Codename of the element has to be provided`);
        }
    }

    /**
     * Gets the runnable Promise
     */
    toPromise(): Promise<IKontentNetworkResponse<ElementResponses.IViewContentTypeElementResponse>> {
        return this.queryService.getElementAsync(this.getUrl(), this._queryConfig ?? {});
    }

    /**
     * Gets 'Url' representation of query
     */
    getUrl(): string {
        const action = '/types/' + this.typeCodename + '/elements/' + this.elementCodename;

        return super.resolveUrlInternal(action);
    }
}
