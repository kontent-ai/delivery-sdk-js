import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import { IContentTypeQueryConfig, IDeliveryNetworkResponse, Responses } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';

export class SingleTypeQuery extends BaseQuery<
    Responses.IViewContentTypeResponse,
    IContentTypeQueryConfig,
    Contracts.IViewContentTypeContract
> {
    protected _queryConfig: IContentTypeQueryConfig = {};

    constructor(
        protected config: IDeliveryClientConfig,
        protected queryService: QueryService,
        private typeCodename: string
    ) {
        super(config, queryService);

        if (!typeCodename) {
            throw Error(`Cannot create type query without the codename of the type`);
        }
    }

    toPromise(): Promise<
        IDeliveryNetworkResponse<Responses.IViewContentTypeResponse, Contracts.IViewContentTypeContract>
    > {
        return this.queryService.getSingleType(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        const action = '/types/' + this.typeCodename;

        return super.resolveUrlInternal(action);
    }

    map(json: any): Responses.IViewContentTypeResponse {
        return this.queryService.mappingService.viewContentTypeResponse(json);
    }
}
