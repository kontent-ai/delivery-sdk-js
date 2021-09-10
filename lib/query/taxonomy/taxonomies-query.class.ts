import { IDeliveryClientConfig } from '../../config';
import { continuationTokenHeaderName, ITaxonomyQueryConfig, Parameters, TaxonomyResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseListingQuery } from '../common/base-listing-query.class';

export class TaxonomiesQuery extends BaseListingQuery<
    TaxonomyResponses.ListTaxonomiesResponse,
    TaxonomyResponses.ListTaxonomiesAllResponse,
    ITaxonomyQueryConfig
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

    /**
     * Gets the runnable Promise
     */
    toPromise(): Promise<TaxonomyResponses.ListTaxonomiesResponse> {
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

    /**
     * Gets 'Url' representation of query
     */
    getUrl(): string {
        const action = '/' + this.taxonomiesEndpoint;

        return super.resolveUrlInternal(action);
    }

    protected allResponseFactory(
        items: any[],
        responses: TaxonomyResponses.ListTaxonomiesResponse[]
    ): TaxonomyResponses.ListTaxonomiesAllResponse {
        return new TaxonomyResponses.ListTaxonomiesAllResponse(items, responses);
    }
}
