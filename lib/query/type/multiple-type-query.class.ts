import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import { IContentTypeQueryConfig, IDeliveryNetworkResponse, Responses } from '../../models';
import { QueryService } from '../../services';
import { BaseListingQuery } from '../common/base-listing-query.class';

export class MultipleTypeQuery extends BaseListingQuery<
    Responses.IListContentTypesResponse,
    Responses.IListContentTypesAllResponse,
    IContentTypeQueryConfig,
    Contracts.IListContentTypeContract
> {
    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
    }

    toPromise(): Promise<
        IDeliveryNetworkResponse<Responses.IListContentTypesResponse, Contracts.IListContentTypeContract>
    > {
        return this.queryService.getMultipleTypes(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        const action = '/types';

        return super.resolveUrlInternal(action);
    }

    map(json: any): Responses.IListContentTypesResponse {
        return this.queryService.mappingService.listContentTypesResponse(json);
    }

    protected allResponseFactory(
        items: any[],
        responses: IDeliveryNetworkResponse<
            Responses.IListContentTypesResponse,
            Contracts.IListContentTypeContract
        >[]
    ): Responses.IListContentTypesAllResponse {
        return {
            items: items,
            responses: responses
        };
    }
}
