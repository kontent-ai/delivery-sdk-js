import { Observable } from 'rxjs';

import { IDeliveryClientConfig } from '../../config';
import { TaxonomyResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseTaxonomyQuery } from './base-taxonomy-query.class';

export class TaxonomyQuery extends BaseTaxonomyQuery<TaxonomyResponses.TaxonomyResponse> {

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
    * Gets the runnable Observable
    */
    toObservable(): Observable<TaxonomyResponses.TaxonomyResponse> {
        return super.runTaxonomyQuery(this.taxonomyCodename);
    }

    /**
    * Gets 'Url' representation of query
    */
    getUrl(): string {
        return super.getTaxonomyQueryUrl(this.taxonomyCodename);
    }
}
