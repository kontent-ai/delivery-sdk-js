import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import { IDeliveryNetworkResponse, ITaxonomyQueryConfig, Responses } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';

export class TaxonomyQuery extends BaseQuery<
    Responses.IViewTaxonomyResponse,
    ITaxonomyQueryConfig,
    Contracts.IViewTaxonomyGroupContract
> {
    /**
     * Taxonomies endpoint URL action
     */
    protected readonly taxonomiesEndpoint: string = 'taxonomies';

    protected _queryConfig: ITaxonomyQueryConfig = {};

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

    toPromise(): Promise<
        IDeliveryNetworkResponse<Responses.IViewTaxonomyResponse, Contracts.IViewTaxonomyGroupContract>
    > {
        return this.queryService.getTaxonomy(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        const action = '/' + this.taxonomiesEndpoint + '/' + this.taxonomyCodename;

        return super.resolveUrlInternal(action);
    }

    map(json: any): Responses.IViewTaxonomyResponse {
        return this.queryService.mappingService.viewTaxonomyResponse(json);
    }
}
