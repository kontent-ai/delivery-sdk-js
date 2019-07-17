import { IPaginationContract } from './shared/ipagination.interface';

export namespace TaxonomyContracts {

    export interface ITaxonomyTermsContract {
        name: string;
        codename: string;
        terms: ITaxonomyTermsContract[];
    }

    export interface ITaxonomySystemAttributesContract {
        id: string;
        name: string;
        codename: string;
        last_modified: Date;
    }

    export interface ITaxonomyGroupContract {
        system: ITaxonomySystemAttributesContract;
        terms: ITaxonomyTermsContract[];
    }

    export interface IViewTaxonomyGroupContract {
        system: ITaxonomySystemAttributesContract;
        terms: ITaxonomyTermsContract[];
    }

    export interface IListTaxonomyGroupsContract {
        taxonomies: ITaxonomyGroupContract[];
        pagination: IPaginationContract;
    }
}
