import { Observable } from 'rxjs/Observable';

import { DeliveryClientConfig } from '../../config/delivery-client.config';
import { TaxonomyResponses } from '../../models/taxonomy/responses';
import { QueryService } from '../../services/query.service';
import { BaseTaxonomyQuery } from './base-taxonomy-query.class';

export class TaxonomyQuery extends BaseTaxonomyQuery<TaxonomyResponses.TaxonomyResponse> {

    constructor(
        protected config: DeliveryClientConfig,
        protected queryService: QueryService,
        private taxonomyCodename: string
    ) {
        super(config, queryService);

        if (!taxonomyCodename) {
            throw Error(`Cannot create taxonomy query without codename of the taxonomy`);
        }
    }

     /**
     * Gets the runnable Observable
     */
    get(): Observable<TaxonomyResponses.TaxonomyResponse> {
        return super.runTaxonomyQuery(this.taxonomyCodename);
    }

     /**
     * Gets 'Url' representation of query
     */
    toString(): string {
        return super.getTaxonomyQueryUrl(this.taxonomyCodename);
    }
}
