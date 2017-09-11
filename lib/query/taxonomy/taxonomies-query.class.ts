
// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// models
import { TaxonomyResponses } from '../../models/taxonomy/responses';

// base query
import { BaseTaxonomyQuery } from './base-taxonomy-query.class';

// query params
import { Parameters } from '../../models/common/parameters';

// rxjs
import { Observable } from 'rxjs/Rx';

export class TaxonomiesQuery extends BaseTaxonomyQuery {

    constructor(
        protected config: DeliveryClientConfig,
    ) {
        super(config)
    }

    // query params

    limitParameter(limit: number): this {
        this.parameters.push(new Parameters.LimitParameter(limit));
        return this;
    }

    skipParameter(skip: number): this {
        this.parameters.push(new Parameters.SkipParameter(skip));
        return this;
    }

    // execution

    get(): Observable<TaxonomyResponses.TaxonomiesResponse> {
        return super.runTaxonomiesQuery();
    }

    // debug

    toString(): string {
        return super.getTaxonomiesQueryUrl();
    }
}