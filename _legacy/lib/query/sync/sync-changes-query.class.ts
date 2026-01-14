import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import { IItemQueryConfig, IDeliveryNetworkResponse, Responses, ClientTypes, IContentItemDelta } from '../../models';
import { QueryService } from '../../services';
import { BaseListingQuery } from '../common/base-listing-query.class';

export class SyncChangesQuery<TClientTypes extends ClientTypes> extends BaseListingQuery<
    TClientTypes,
    IContentItemDelta,
    Responses.ISyncChangesResponse,
    Responses.ISyncChangesAllResponse,
    IItemQueryConfig,
    Contracts.ISyncChangesContract
> {
    protected _queryConfig: IItemQueryConfig = {};

    private readonly action: string = '/sync';

    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService<TClientTypes>) {
        super(config, queryService);
    }

    toPromise(): Promise<IDeliveryNetworkResponse<Responses.ISyncChangesResponse, Contracts.ISyncChangesContract>> {
        console.warn(
            `Sync Api v1 is deprecated. Please use the new Sync Api v2. https://kontent.ai/learn/docs/apis/openapi/sync-api-v2/`
        );
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
        items: IContentItemDelta[],
        responses: IDeliveryNetworkResponse<Responses.ISyncChangesResponse, Contracts.ISyncChangesContract>[]
    ): Responses.ISyncChangesAllResponse {
        return {
            items: items,
            responses: responses
        };
    }
}
