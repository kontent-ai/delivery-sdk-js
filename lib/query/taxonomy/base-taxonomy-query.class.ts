import { Observable } from 'rxjs/Observable';

import { DeliveryClientConfig } from '../../config/delivery-client.config';
import { IHeader } from '../../interfaces/common/iheader.interface';
import { ITaxonomyQueryConfig } from '../../interfaces/taxonomy/itaxonomy-query.config';
import { TaxonomyResponses } from '../../models/taxonomy/responses';
import { TaxonomyQueryConfig } from '../../models/taxonomy/taxonomy-query.config';
import { QueryService } from '../../services/query.service';
import { BaseQuery } from '../common/base-query.class';

export abstract class BaseTaxonomyQuery<TResponse> extends BaseQuery<TResponse> {

    /**
     * Taxonomies endpoint URL action
     */
    protected readonly taxonomiesEndpoint: string = 'taxonomies';

    /**
     * Query configuration
     */
    protected _queryConfig: ITaxonomyQueryConfig = new TaxonomyQueryConfig();

    constructor(
        protected config: DeliveryClientConfig,
        protected queryService: QueryService
    ) {
        super(config, queryService)
    }

    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: ITaxonomyQueryConfig): this {
        this._queryConfig = queryConfig;
        return this;
    }

    /**
     * Gets headers used by this query
     */
    getHeaders(): IHeader[] {
        return this.queryService.getHeaders(this._queryConfig);
    }

    protected getTaxonomyQueryUrl(taxonomyCodename: string): string {
        const action = '/' + this.taxonomiesEndpoint + '/' + taxonomyCodename;

        return this.queryService.getUrl(action, this._queryConfig, this.getParameters());
    }

    protected getTaxonomiesQueryUrl(): string {
        const action = '/' + this.taxonomiesEndpoint;

        return this.queryService.getUrl(action, this._queryConfig, this.getParameters());
    }

    protected runTaxonomyQuery(codename: string): Observable<TaxonomyResponses.TaxonomyResponse> {
        return this.queryService.getTaxonomy(this.getTaxonomyQueryUrl(codename), this._queryConfig);
    }

    protected runTaxonomiesQuery(): Observable<TaxonomyResponses.TaxonomiesResponse> {
        return this.queryService.getTaxonomies(this.getTaxonomiesQueryUrl(), this._queryConfig);
    }
}
