import { TypeContracts } from '../../data-contracts/type-contracts';
import { IDeliveryClientConfig } from '../../config';
import { IContentTypeQueryConfig, INetworkResponse, Responses } from '../../models';
import { QueryService } from '../../services';
import { BaseListingQuery } from '../common/base-listing-query.class';

export class MultipleTypeQuery extends BaseListingQuery<
    Responses.IListContentTypesResponse,
    Responses.IListContentTypesAllResponse,
    IContentTypeQueryConfig,
    TypeContracts.IListContentTypeContract
> {
    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
    }

    toPromise(): Promise<
        INetworkResponse<Responses.IListContentTypesResponse, TypeContracts.IListContentTypeContract>
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
        responses: INetworkResponse<
            Responses.IListContentTypesResponse,
            TypeContracts.IListContentTypeContract
        >[]
    ): Responses.IListContentTypesAllResponse {
        return {
            items: items,
            responses: responses
        };
    }
}
