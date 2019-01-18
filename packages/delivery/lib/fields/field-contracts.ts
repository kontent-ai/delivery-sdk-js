export namespace FieldContracts {

    export interface IFieldContract {
        name: string;
        type: string;
        value: any;
        taxonomy_group?: string;
    }

    export interface IAssetContract {
        name: string;
        type: string;
        size: number;
        description: string;
        url: string;
    }

    export interface IMultipleChoiceOptionContract {
        name: string;
        codename: string;
    }

    export interface ITaxonomyTerm {
        name: string;
        codename: string;
    }

    export interface IRichTextFieldContract extends IFieldContract {

        /**
         * Modular content items
         */
        modular_content: string[];

        /**
         * Json with links identified by item Id
         */
        links: any;
    }
}
