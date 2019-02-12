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

    export interface IRichTextFieldLinkWrapperContract {
        [key: string]: IRichTextFieldLinkContract;
    }

    export interface IRichTextFieldLinkContract {
        type: string;
        codename: string;
        url_slug: string;
    }

    export interface IRichTextFieldImageWrapperContract {
        [key: string]: IRichTextFieldImageContract;
    }

    export interface IRichTextFieldImageContract {
        image_id: string;
        url: string;
        description?: string;
    }

    export interface IRichTextFieldContract extends IFieldContract {

        /**
         * Modular content items
         */
        modular_content: string[];

        /**
         * Json with links
         */
        links: IRichTextFieldLinkWrapperContract;

        /**
         * Json with images
         */
        images: IRichTextFieldImageWrapperContract;
    }
}
