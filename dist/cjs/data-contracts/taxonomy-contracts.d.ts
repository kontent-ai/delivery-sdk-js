import { IPaginationContract } from './shared/ipagination.interface';
export declare namespace TaxonomyContracts {
    interface ITaxonomyTermsContract {
        name: string;
        codename: string;
        terms: ITaxonomyTermsContract[];
    }
    interface ITaxonomySystemAttributesContract {
        id: string;
        name: string;
        codename: string;
        last_modified: Date;
    }
    interface ITaxonomyGroupContract {
        system: ITaxonomySystemAttributesContract;
        terms: ITaxonomyTermsContract[];
    }
    interface IViewTaxonomyGroupContract {
        system: ITaxonomySystemAttributesContract;
        terms: ITaxonomyTermsContract[];
    }
    interface IListTaxonomyGroupsContract {
        taxonomies: ITaxonomyGroupContract[];
        pagination: IPaginationContract;
    }
}
