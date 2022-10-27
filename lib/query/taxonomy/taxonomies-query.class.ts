import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import {
    IDeliveryNetworkResponse,
    ITaxonomyQueryConfig,
    Parameters,
    Responses
} from '../../models';
import { QueryService } from '../../services';
import { BaseListingQuery } from '../common/base-listing-query.class';

export class TaxonomiesQuery extends BaseListingQuery<
    Responses.IListTaxonomiesResponse,
    Responses.IListTaxonomiesAllResponse,
    ITaxonomyQueryConfig,
    Contracts.IListTaxonomyGroupsContract
> {
    /**
     * Taxonomies endpoint URL action
     */
    protected readonly taxonomiesEndpoint: string = 'taxonomies';

    protected _queryConfig: ITaxonomyQueryConfig = {};

    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
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
            Responses.IListTaxonomiesResponse,
            Contracts.IListTaxonomyGroupsContract
        >
    > {
        return this.queryService.getTaxonomies(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        const action = '/' + this.taxonomiesEndpoint;

        return super.resolveUrlInternal(action);
    }

    map(json: any): Responses.IListTaxonomiesResponse {
        return this.queryService.mappingService.listTaxonomiesResponse(json);
    }

    protected allResponseFactory(
        items: any[],
        responses: IDeliveryNetworkResponse<
            Responses.IListTaxonomiesResponse,
            Contracts.IListTaxonomyGroupsContract
        >[]
    ): Responses.IListTaxonomiesAllResponse {
        return {
            items: items,
            responses: responses
        };
    }
}
