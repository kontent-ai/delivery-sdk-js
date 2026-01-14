import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import {
    ClientTypes,
    IDeliveryNetworkResponse,
    ITaxonomyGroup,
    ITaxonomyQueryConfig,
    Parameters,
    Responses
} from '../../models';
import { QueryService } from '../../services';
import { BaseListingQuery } from '../common/base-listing-query.class';

export class TaxonomiesQuery<TClientTypes extends ClientTypes> extends BaseListingQuery<
    TClientTypes,
    ITaxonomyGroup<TClientTypes['taxonomyCodenames']>,
    Responses.IListTaxonomiesResponse<TClientTypes['taxonomyCodenames']>,
    Responses.IListTaxonomiesAllResponse<TClientTypes['taxonomyCodenames']>,
    ITaxonomyQueryConfig,
    Contracts.IListTaxonomyGroupsContract
> {
    /**
     * Taxonomies endpoint URL action
     */
    protected readonly taxonomiesEndpoint: string = 'taxonomies';

    protected _queryConfig: ITaxonomyQueryConfig = {};

    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService<TClientTypes>) {
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
            Responses.IListTaxonomiesResponse<TClientTypes['taxonomyCodenames']>,
            Contracts.IListTaxonomyGroupsContract
        >
    > {
        return this.queryService.getTaxonomies(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        const action = '/' + this.taxonomiesEndpoint;

        return super.resolveUrlInternal(action);
    }

    map(json: any): Responses.IListTaxonomiesResponse<TClientTypes['taxonomyCodenames']> {
        return this.queryService.mappingService.listTaxonomiesResponse(json);
    }

    protected allResponseFactory(
        items: ITaxonomyGroup<TClientTypes['taxonomyCodenames']>[],
        responses: IDeliveryNetworkResponse<
            Responses.IListTaxonomiesResponse<TClientTypes['taxonomyCodenames']>,
            Contracts.IListTaxonomyGroupsContract
        >[]
    ): Responses.IListTaxonomiesAllResponse<TClientTypes['taxonomyCodenames']> {
        return {
            items: items,
            responses: responses
        };
    }
}
