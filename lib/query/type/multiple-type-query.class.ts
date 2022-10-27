import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import { IContentTypeQueryConfig, IDeliveryNetworkResponse, Parameters, Responses } from '../../models';
import { QueryService } from '../../services';
import { BaseListingQuery } from '../common/base-listing-query.class';

export class MultipleTypeQuery extends BaseListingQuery<
    Responses.IListContentTypesResponse,
    Responses.IListContentTypesAllResponse,
    IContentTypeQueryConfig,
    Contracts.IListContentTypeContract
> {
    protected _queryConfig: IContentTypeQueryConfig = {};

    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
    }

    /**
     * Used to limit the number of elements returned by query.
     * @param elementCodenames Array of element codenames to fetch
     */
    elementsParameter(elementCodenames: string[]): this {
        this.parameters.push(new Parameters.ElementsParameter(elementCodenames));
        return this;
    }

    /**
     * Limits the number of taxonomies returned by query
     * @param limit Number of taxonomies to load
     */
    limitParameter(limit: number): this {
        this.parameters.push(new Parameters.LimitParameter(limit));
        return this;
    }

    /**
     * Skips the selected number of taxonomies
     * @param skip Number of taxonomies to skip
     */
    skipParameter(skip: number): this {
        this.parameters.push(new Parameters.SkipParameter(skip));
        return this;
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
        responses: IDeliveryNetworkResponse<Responses.IListContentTypesResponse, Contracts.IListContentTypeContract>[]
    ): Responses.IListContentTypesAllResponse {
        return {
            items: items,
            responses: responses
        };
    }
}
