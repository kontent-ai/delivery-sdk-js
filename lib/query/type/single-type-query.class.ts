import { IDeliveryClientConfig } from '../../config';
import { IContentTypeQueryConfig, IKontentNetworkResponse, TypeResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';

export class SingleTypeQuery extends BaseQuery<TypeResponses.ViewContentTypeResponse, IContentTypeQueryConfig> {
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

    /**
     * Gets the runnable Promise
     */
    toPromise(): Promise<IKontentNetworkResponse<TypeResponses.ViewContentTypeResponse>> {
        return this.queryService.getSingleType(this.getUrl(), this._queryConfig ?? {});
    }

    /**
     * Gets 'Url' representation of query
     */
    getUrl(): string {
        const action = '/types/' + this.typeCodename;

        return super.resolveUrlInternal(action);
    }
}
