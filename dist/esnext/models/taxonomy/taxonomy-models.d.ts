import { IQueryConfig } from '../common/common-models';
export declare class TaxonomyGroup {
    system: TaxonomySystemAttributes;
    terms: TaxonomyTerms[];
    constructor(system: TaxonomySystemAttributes, terms: TaxonomyTerms[]);
}
export declare class TaxonomySystemAttributes {
    id: string;
    name: string;
    codename: string;
    lastModified: Date;
    constructor(data: {
        id: string;
        name: string;
        codename: string;
        lastModified: Date;
    });
}
export declare class TaxonomyTerms {
    name: string;
    codename: string;
    terms: TaxonomyTerms[];
    constructor(data: {
        name: string;
        codename: string;
        terms: TaxonomyTerms[];
    });
}
export interface ITaxonomyQueryConfig extends IQueryConfig {
}
