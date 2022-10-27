import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import { Responses, IElementQueryConfig, IDeliveryNetworkResponse } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';

export class ElementQuery extends BaseQuery<
    Responses.IViewContentTypeElementResponse,
    IElementQueryConfig,
    Contracts.IViewContentTypeElementContract
> {

    protected _queryConfig: IElementQueryConfig = {};

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
        IDeliveryNetworkResponse<
            Responses.IViewContentTypeElementResponse,
            Contracts.IViewContentTypeElementContract
        >
    > {
        return this.queryService.getElementAsync(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        return super.resolveUrlInternal(`/types/${this.typeCodename}/elements/${this.elementCodename}`);
    }

    map(json: any): Responses.IViewContentTypeElementResponse {
        return this.queryService.mappingService.viewContentTypeElementResponse(json);
    }
}
