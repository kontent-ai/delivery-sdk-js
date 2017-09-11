import { TaxonomySystemAttributes } from './taxonomy-system-attributes.class';
import { TaxonomyTerms } from './taxonomy-terms.class';
import { TaxonomyGroup } from './taxonomy-group.class';

export namespace TaxonomyResponses {

    export class TaxonomyResponse {
        constructor(
            public system: TaxonomySystemAttributes,
            public terms: TaxonomyTerms[]
        ) {
        }
    }

    export class TaxonomiesResponse {
        constructor(
            public taxonomies: TaxonomyGroup[]
        ) {
        }
    }
}