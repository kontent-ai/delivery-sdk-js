import { IDeliveryClientConfig } from '../../config';
import { IContentTypeQueryConfig, IKontentNetworkResponse, TypeResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseListingQuery } from '../common/base-listing-query.class';

export class MultipleTypeQuery extends BaseListingQuery<
    TypeResponses.ListContentTypesResponse,
    TypeResponses.ListContentTypesAllResponse,
    IContentTypeQueryConfig
> {
    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
    }

    /**
     * Gets the runnable Promise
     */
    toPromise(): Promise<IKontentNetworkResponse<TypeResponses.ListContentTypesResponse>> {
        return this.queryService.getMultipleTypes(this.getUrl(), this._queryConfig ?? {});
    }

    /**
     * Gets 'Url' representation of query
     */
    getUrl(): string {
        const action = '/types';

        return super.resolveUrlInternal(action);
    }

    protected allResponseFactory(
        items: any[],
        responses: IKontentNetworkResponse<TypeResponses.ListContentTypesResponse>[]
    ): TypeResponses.ListContentTypesAllResponse {
        return new TypeResponses.ListContentTypesAllResponse(items, responses);
    }
}
