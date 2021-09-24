import { TaxonomyContracts } from '../../data-contracts/taxonomy-contracts';
import { IDeliveryClientConfig } from '../../config';
import {
    continuationTokenHeaderName,
    IKontentNetworkResponse,
    ITaxonomyQueryConfig,
    Parameters,
    TaxonomyResponses
} from '../../models';
import { QueryService } from '../../services';
import { BaseListingQuery } from '../common/base-listing-query.class';

export class TaxonomiesQuery extends BaseListingQuery<
    TaxonomyResponses.IListTaxonomiesResponse,
    TaxonomyResponses.IListTaxonomiesAllResponse,
    ITaxonomyQueryConfig,
    TaxonomyContracts.IListTaxonomyGroupsContract
> {
    /**
     * Taxonomies endpoint URL action
     */
    protected readonly taxonomiesEndpoint: string = 'taxonomies';

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
        IKontentNetworkResponse<
            TaxonomyResponses.IListTaxonomiesResponse,
            TaxonomyContracts.IListTaxonomyGroupsContract
        >
    > {
        return this.queryService.getTaxonomies(this.getUrl(), this._queryConfig ?? {});
    }

    /**
     * Sets continuation token header
     */
    withContinuationToken(token: string): this {
        this.withHeaders([
            {
                header: continuationTokenHeaderName,
                value: token
            }
        ]);

        return this;
    }

    getUrl(): string {
        const action = '/' + this.taxonomiesEndpoint;

        return super.resolveUrlInternal(action);
    }

    map(json: any): TaxonomyResponses.IListTaxonomiesResponse {
        return this.queryService.mappingService.listTaxonomiesResponse(json);
    }

    protected allResponseFactory(
        items: any[],
        responses: IKontentNetworkResponse<
            TaxonomyResponses.IListTaxonomiesResponse,
            TaxonomyContracts.IListTaxonomyGroupsContract
        >[]
    ): TaxonomyResponses.IListTaxonomiesAllResponse {
        return {
            items: items,
            responses: responses
        };
    }
}
