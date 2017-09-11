// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// filters
import { Filters } from '../../models/common/filters';

// models
import { IQueryParameter } from '../../interfaces/common/iquery-parameter.interface';
import { TaxonomyResponses } from '../../models/taxonomy/responses';
import { IQueryConfig } from '../../interfaces/common/iquery.config';
import { QueryConfig } from '../../models/common/query.config';

// base query
import { BaseQuery } from '../common/base-query.class';

// rxjs
import { Observable } from 'rxjs/Rx';

export abstract class BaseTaxonomyQuery extends BaseQuery {

    protected readonly taxonomiesEndpoint: string = 'taxonomies';
    protected parameters: IQueryParameter[] = [];
    protected queryConfig: IQueryConfig = new QueryConfig();

    constructor(
        protected config: DeliveryClientConfig,
    ) {
        super(config)
    }

    protected getTaxonomyQueryUrl(taxonomyCodename: string): string {
        var action = '/' + this.taxonomiesEndpoint + '/' + taxonomyCodename;

        return this.getUrl(action, this.queryConfig, this.parameters);
    }

    protected getTaxonomiesQueryUrl(): string {
        var action = '/' + this.taxonomiesEndpoint;

        return this.getUrl(action, this.queryConfig, this.parameters);
    }

    protected runTaxonomyQuery(codename: string): Observable<TaxonomyResponses.TaxonomyResponse> {
        return super.getTaxonomy(this.getTaxonomyQueryUrl(codename));
    }

    protected runTaxonomiesQuery(): Observable<TaxonomyResponses.TaxonomiesResponse> {
        return super.getTaxonomies(this.getTaxonomiesQueryUrl());
    }
}