import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import { ClientTypes, IDeliveryNetworkResponse, ITaxonomyQueryConfig, Responses } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';

export class TaxonomyQuery<TClientTypes extends ClientTypes> extends BaseQuery<
    TClientTypes,
    Responses.IViewTaxonomyResponse<TClientTypes['taxonomyCodenames']>,
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
        protected queryService: QueryService<TClientTypes>,
        private taxonomyCodename: string
    ) {
        super(config, queryService);

        if (!taxonomyCodename) {
            throw Error(`Cannot create taxonomy query without codename of the taxonomy`);
        }
    }

    toPromise(): Promise<
        IDeliveryNetworkResponse<
            Responses.IViewTaxonomyResponse<TClientTypes['taxonomyCodenames']>,
            Contracts.IViewTaxonomyGroupContract
        >
    > {
        return this.queryService.getTaxonomy(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        const action = '/' + this.taxonomiesEndpoint + '/' + this.taxonomyCodename;

        return super.resolveUrlInternal(action);
    }

    map(json: any): Responses.IViewTaxonomyResponse<TClientTypes['taxonomyCodenames']> {
        return this.queryService.mappingService.viewTaxonomyResponse(json);
    }
}
