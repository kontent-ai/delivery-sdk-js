import { IDeliveryClientConfig } from '../../config';
import { ITaxonomyQueryConfig, TaxonomyResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';

export class TaxonomyQuery extends BaseQuery<TaxonomyResponses.ViewTaxonomyResponse, ITaxonomyQueryConfig> {
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
    toPromise(): Promise<TaxonomyResponses.ViewTaxonomyResponse> {
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
