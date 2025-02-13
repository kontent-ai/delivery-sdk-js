import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import { ClientTypes, IContentTypeQueryConfig, IDeliveryNetworkResponse, Responses } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';

export class SingleTypeQuery<TClientTypes extends ClientTypes> extends BaseQuery<
    TClientTypes,
    Responses.IViewContentTypeResponse<TClientTypes['contentTypeCodenames']>,
    IContentTypeQueryConfig,
    Contracts.IViewContentTypeContract
> {
    protected _queryConfig: IContentTypeQueryConfig = {};

    constructor(
        protected config: IDeliveryClientConfig,
        protected queryService: QueryService<TClientTypes>,
        private typeCodename: string
    ) {
        super(config, queryService);

        if (!typeCodename) {
            throw Error(`Cannot create type query without the codename of the type`);
        }
    }

    toPromise(): Promise<
        IDeliveryNetworkResponse<
            Responses.IViewContentTypeResponse<TClientTypes['contentTypeCodenames']>,
            Contracts.IViewContentTypeContract
        >
    > {
        return this.queryService.getSingleType(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        const action = '/types/' + this.typeCodename;

        return super.resolveUrlInternal(action);
    }

    map(json: any): Responses.IViewContentTypeResponse<TClientTypes['contentTypeCodenames']> {
        return this.queryService.mappingService.viewContentTypeResponse(json);
    }
}
