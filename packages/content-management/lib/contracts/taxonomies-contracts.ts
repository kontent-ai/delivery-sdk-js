export namespace TaxonomiesContracts {

    export interface ITaxonomyContract {
        last_modified: string;
        name: string;
        id: string;
        codename: string;
        terms: ITaxonomyContract[];
    }

    export interface IViewTaxonomyResponseContract extends ITaxonomyContract {
    }

    export interface IAddTaxonomyResponseContract extends ITaxonomyContract {
    }

    export interface IDeleteResponseContract {
    }
}
