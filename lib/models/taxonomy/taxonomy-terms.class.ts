export class TaxonomyTerms {
    constructor(
        public name: string,
        public codename: string,
        public terms: TaxonomyTerms[]
    ) {
    }
}