import { TaxonomySystemAttributes } from './taxonomy-system-attributes.class';
import { TaxonomyTerms } from './taxonomy-terms.class';

export class TaxonomyGroup {
    constructor(
        public system: TaxonomySystemAttributes,
        public terms: TaxonomyTerms[]
    ) { }
}