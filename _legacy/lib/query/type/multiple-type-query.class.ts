import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import {
    ClientTypes,
    IContentType,
    IContentTypeQueryConfig,
    IDeliveryNetworkResponse,
    Parameters,
    Responses
} from '../../models';
import { QueryService } from '../../services';
import { BaseListingQuery } from '../common/base-listing-query.class';

export class MultipleTypeQuery<TClientTypes extends ClientTypes> extends BaseListingQuery<
    TClientTypes,
    IContentType<TClientTypes['contentTypeCodenames']>,
    Responses.IListContentTypesResponse<TClientTypes['contentTypeCodenames']>,
    Responses.IListContentTypesAllResponse<TClientTypes['contentTypeCodenames']>,
    IContentTypeQueryConfig,
    Contracts.IListContentTypeContract
> {
    protected _queryConfig: IContentTypeQueryConfig = {};

    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService<TClientTypes>) {
        super(config, queryService);
    }

    /**
     * Used to limit the number of elements returned by query.
     * @param elementCodenames Array of element codenames to fetch
     */
    elementsParameter(elementCodenames: TClientTypes['elementCodenames'][]): this {
        this.parameters.push(new Parameters.ElementsParameter(elementCodenames));
        return this;
    }

    /**
     * Used to exclude elements returned by query.
     * @param elementCodenames Array of element codenames to exclude
     */
    excludeElementsParameter(elementCodenames: TClientTypes['elementCodenames'][]): this {
        this.parameters.push(new Parameters.ExcludeElementsParameter(elementCodenames));
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
        IDeliveryNetworkResponse<
            Responses.IListContentTypesResponse<TClientTypes['contentTypeCodenames']>,
            Contracts.IListContentTypeContract
        >
    > {
        return this.queryService.getMultipleTypes(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        const action = '/types';

        return super.resolveUrlInternal(action);
    }

    map(json: any): Responses.IListContentTypesResponse<TClientTypes['contentTypeCodenames']> {
        return this.queryService.mappingService.listContentTypesResponse(json);
    }

    protected allResponseFactory(
        items: IContentType<TClientTypes['contentTypeCodenames']>[],
        responses: IDeliveryNetworkResponse<
            Responses.IListContentTypesResponse<TClientTypes['contentTypeCodenames']>,
            Contracts.IListContentTypeContract
        >[]
    ): Responses.IListContentTypesAllResponse<TClientTypes['contentTypeCodenames']> {
        return {
            items: items,
            responses: responses
        };
    }
}
