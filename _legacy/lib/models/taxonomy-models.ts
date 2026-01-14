import { IQueryConfig } from './common/common-models';

export interface ITaxonomyGroup<TaxonomyCodename extends string> {
    system: ITaxonomySystemAttributes<TaxonomyCodename>;
    terms: ITaxonomyTerms[];
}

export interface ITaxonomySystemAttributes<TaxonomyCodename extends string> {
    id: string;
    name: string;
    codename: TaxonomyCodename;
    lastModified: Date;
}

export interface ITaxonomyTerms {
    name: string;
    codename: string;
    terms: ITaxonomyTerms[];
}

export interface ITaxonomyQueryConfig extends IQueryConfig {
    /**
     * No dedicated properties required at this moment
     */
}
