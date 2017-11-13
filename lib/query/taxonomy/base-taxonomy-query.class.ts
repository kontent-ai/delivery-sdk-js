// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// filters
import { Filters } from '../../models/common/filters';

// models
import { IQueryParameter } from '../../interfaces/common/iquery-parameter.interface';
import { TaxonomyResponses } from '../../models/taxonomy/responses';
import { ITaxonomyQueryConfig } from '../../interfaces/taxonomy/itaxonomy-query.config';
import { TaxonomyQueryConfig } from '../../models/taxonomy/taxonomy-query.config';

// base query
import { BaseQuery } from '../common/base-query.class';

// models
import { IHeader } from '../../interfaces/common/iheader.interface';

// rxjs
import { Observable } from 'rxjs/Rx';

// services
import { QueryService } from '../../services/query.service';

export abstract class BaseTaxonomyQuery extends BaseQuery {

    /**
     * Taxonomies endpoint URL action
     */
    protected readonly taxonomiesEndpoint: string = 'taxonomies';

    /**
     * Query parameters
     */
    protected parameters: IQueryParameter[] = [];

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

        return this.queryService.getUrl(action, this._queryConfig, this.parameters);
    }

    protected getTaxonomiesQueryUrl(): string {
        const action = '/' + this.taxonomiesEndpoint;

        return this.queryService.getUrl(action, this._queryConfig, this.parameters);
    }

    protected runTaxonomyQuery(codename: string): Observable<TaxonomyResponses.TaxonomyResponse> {
        return this.queryService.getTaxonomy(this.getTaxonomyQueryUrl(codename), this._queryConfig);
    }

    protected runTaxonomiesQuery(): Observable<TaxonomyResponses.TaxonomiesResponse> {
        return this.queryService.getTaxonomies(this.getTaxonomiesQueryUrl(), this._queryConfig);
    }
}
