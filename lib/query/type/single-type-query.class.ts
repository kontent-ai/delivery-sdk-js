import { TypeContracts } from '../../data-contracts/type-contracts';
import { IDeliveryClientConfig } from '../../config';
import { IContentTypeQueryConfig, INetworkResponse, TypeResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';

export class SingleTypeQuery extends BaseQuery<
    TypeResponses.IViewContentTypeResponse,
    IContentTypeQueryConfig,
    TypeContracts.IViewContentTypeContract
> {
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
        INetworkResponse<TypeResponses.IViewContentTypeResponse, TypeContracts.IViewContentTypeContract>
    > {
        return this.queryService.getSingleType(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        const action = '/types/' + this.typeCodename;

        return super.resolveUrlInternal(action);
    }

    map(json: any): TypeResponses.IViewContentTypeResponse {
        return this.queryService.mappingService.viewContentTypeResponse(json);
    }
}
