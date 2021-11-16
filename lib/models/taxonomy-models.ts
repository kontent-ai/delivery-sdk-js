import { IQueryConfig } from './common/common-models';

export interface ITaxonomyGroup {
    system: ITaxonomySystemAttributes;
    terms: ITaxonomyTerms[];
}

export interface ITaxonomySystemAttributes {
    id: string;
    name: string;
    codename: string;
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
