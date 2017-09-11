export interface ITaxonomyTerms {
    name: string;
    codename: string;
    terms: ITaxonomyTerms[];
}