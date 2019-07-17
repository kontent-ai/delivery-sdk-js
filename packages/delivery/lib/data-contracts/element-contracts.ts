import { IElementOptionContract } from './shared/elements.interface';

export namespace ElementContracts {

    export interface IViewContentTypeElementContract {
        type: string;
        name: string;
        codename: string;
        taxonomy_group?: string;
        options?: IElementOptionContract[];
    }

    export interface IElementContract {
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
        width?: number;
        height?: number;
    }

    export interface IMultipleChoiceOptionContract {
        name: string;
        codename: string;
    }

    export interface ITaxonomyTerm {
        name: string;
        codename: string;
    }

    export interface IRichTextElementLinkWrapperContract {
        [key: string]: IRichTextElementLinkContract;
    }

    export interface IRichTextElementLinkContract {
        type: string;
        codename: string;
        url_slug: string;
    }

    export interface IRichTextElementImageWrapperContract {
        [key: string]: IRichTextElementImageContract;
    }

    export interface IRichTextElementImageContract {
        image_id: string;
        url: string;
        description?: string;
        height?: number;
        width?: number;
    }

    export interface IRichTextElementContract extends IElementContract {

        /**
         * Modular content items
         */
        modular_content: string[];

        /**
         * Json with links
         */
        links: IRichTextElementLinkWrapperContract;

        /**
         * Json with images
         */
        images: IRichTextElementImageWrapperContract;
    }
}
