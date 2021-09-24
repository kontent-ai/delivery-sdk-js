import { TaxonomyContracts } from '../../data-contracts/taxonomy-contracts';
import { IDeliveryClientConfig } from '../../config';
import { IKontentNetworkResponse, ITaxonomyQueryConfig, TaxonomyResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';

export class TaxonomyQuery extends BaseQuery<
    TaxonomyResponses.IViewTaxonomyResponse,
    ITaxonomyQueryConfig,
    TaxonomyContracts.IViewTaxonomyGroupContract
> {
    /**
     * Taxonomies endpoint URL action
     */
    protected readonly taxonomiesEndpoint: string = 'taxonomies';

    constructor(
        protected config: IDeliveryClientConfig,
        protected queryService: QueryService,
        private taxonomyCodename: string
    ) {
        super(config, queryService);

        if (!taxonomyCodename) {
            throw Error(`Cannot create taxonomy query without codename of the taxonomy`);
        }
    }

    /**
     * Gets the runnable Promise
     */
    toPromise(): Promise<
        IKontentNetworkResponse<TaxonomyResponses.IViewTaxonomyResponse, TaxonomyContracts.IViewTaxonomyGroupContract>
    > {
        return this.queryService.getTaxonomy(this.getUrl(), this._queryConfig ?? {});
    }

    /**
     * Gets 'Url' representation of query
     */
    getUrl(): string {
        const action = '/' + this.taxonomiesEndpoint + '/' + this.taxonomyCodename;

        return super.resolveUrlInternal(action);
    }
}
