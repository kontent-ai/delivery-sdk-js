import { ElementContracts } from '../../data-contracts/element-contracts';
import { IDeliveryClientConfig } from '../../config';
import { ElementResponses, IElementQueryConfig, INetworkResponse } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';

export class ElementQuery extends BaseQuery<
    ElementResponses.IViewContentTypeElementResponse,
    IElementQueryConfig,
    ElementContracts.IViewContentTypeElementContract
> {
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

    toPromise(): Promise<
        INetworkResponse<
            ElementResponses.IViewContentTypeElementResponse,
            ElementContracts.IViewContentTypeElementContract
        >
    > {
        return this.queryService.getElementAsync(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        const action = '/types/' + this.typeCodename + '/elements/' + this.elementCodename;

        return super.resolveUrlInternal(action);
    }

    map(json: any): ElementResponses.IViewContentTypeElementResponse {
        return this.queryService.mappingService.viewContentTypeElementResponse(json);
    }
}
