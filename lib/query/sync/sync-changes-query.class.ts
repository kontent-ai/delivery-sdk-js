import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import { IItemQueryConfig, IDeliveryNetworkResponse, Responses } from '../../models';
import { QueryService } from '../../services';
import { BaseListingQuery } from '../common/base-listing-query.class';

export class SyncChangesQuery extends BaseListingQuery<
    Responses.ISyncChangesResponse,
    Responses.ISyncChangesAllResponse,
    IItemQueryConfig,
    Contracts.ISyncChangesContract
> {
    protected _queryConfig: IItemQueryConfig = {};

    private readonly action: string = '/sync';

    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
    }

    toPromise(): Promise<IDeliveryNetworkResponse<Responses.ISyncChangesResponse, Contracts.ISyncChangesContract>> {
        return this.queryService.syncChanges(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        return super.resolveUrlInternal(this.action);
    }

    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: IItemQueryConfig): this {
        this._queryConfig = queryConfig;
        return this;
    }

    map(json: any): Responses.ISyncChangesResponse {
        return this.queryService.mappingService.syncChanges(json);
    }

    protected allResponseFactory(
        items: any[],
        responses: IDeliveryNetworkResponse<Responses.ISyncChangesResponse, Contracts.ISyncChangesContract>[]
    ): Responses.ISyncChangesAllResponse {
        return {
            items: items,
            responses: responses
        };
    }
}
