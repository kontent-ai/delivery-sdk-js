import { IQueryConfig } from '../common/common-models';

export class TaxonomyGroup {
    constructor(
        public system: TaxonomySystemAttributes,
        public terms: TaxonomyTerms[]
    ) { }
}

export class TaxonomySystemAttributes {

    public id!: string;
    public name!: string;
    public codename!: string;
    public lastModified!: Date;

    constructor(
        data: {
            id: string,
            name: string,
            codename: string,
            lastModified: Date
        }
    ) {
        Object.assign(this, data);
    }
}

export class TaxonomyTerms {

    public name!: string;
    public codename!: string;
    public terms!: TaxonomyTerms[];

    constructor(
        data: {
            name: string,
            codename: string,
            terms: TaxonomyTerms[]
        }
    ) {
        Object.assign(this, data);
    }
}

export interface ITaxonomyQueryConfig extends IQueryConfig {
    /**
     * No dedicated properties required at this moment
     */
}
