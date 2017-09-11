
// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// models
import { TaxonomyResponses } from '../../models/taxonomy/responses';

// base query
import { BaseTaxonomyQuery } from './base-taxonomy-query.class';

// rxjs
import { Observable } from 'rxjs/Rx';

export class TaxonomyQuery extends BaseTaxonomyQuery {

    constructor(
        protected config: DeliveryClientConfig,
        private taxonomyCodename: string
    ) {
        super(config)
    }

    // execution

    get(): Observable<TaxonomyResponses.TaxonomyResponse> {
        return super.runTaxonomyQuery(this.taxonomyCodename);
    }

    // debug

    toString(): string {
        return super.getTaxonomyQueryUrl(this.taxonomyCodename);
    }
}