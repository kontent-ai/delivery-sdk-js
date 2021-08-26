import { IElementOptionContract } from './shared/elements.interface';
export declare namespace ElementContracts {
    interface IViewContentTypeElementContract {
        type: string;
        name: string;
        codename: string;
        taxonomy_group?: string;
        options?: IElementOptionContract[];
    }
    interface IElementContract {
        name: string;
        type: string;
        value: any;
        taxonomy_group?: string;
    }
    interface IAssetContract {
        name: string;
        type: string;
        size: number;
        description: string;
        url: string;
        width?: number;
        height?: number;
    }
    interface IMultipleChoiceOptionContract {
        name: string;
        codename: string;
    }
    interface ITaxonomyTerm {
        name: string;
        codename: string;
    }
    interface IRichTextElementLinkWrapperContract {
        [key: string]: IRichTextElementLinkContract;
    }
    interface IRichTextElementLinkContract {
        type: string;
        codename: string;
        url_slug: string;
    }
    interface IRichTextElementImageWrapperContract {
        [key: string]: IRichTextElementImageContract;
    }
    interface IRichTextElementImageContract {
        image_id: string;
        url: string;
        description?: string;
        height?: number;
        width?: number;
    }
    interface IRichTextElementContract extends IElementContract {
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
