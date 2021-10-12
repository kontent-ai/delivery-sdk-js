export namespace Contracts {
    export interface IPaginationContract {
        skip: number;
        limit: number;
        count: number;
        next_page: string;
        total_count?: number;
    }

    export interface IContentTypeElementContract {
        codename?: string;
        type: string;
        name: string;
        taxonomyGroup?: string;
        options?: IElementOptionContract[];
    }

    export interface IContentTypeElementsContainer {
        [key: string]: IContentTypeElementContract;
    }

    export interface IElementOptionContract {
        name: string;
        codename: string;
    }

    export interface IListLanguagesContract {
        languages: ILanguageContract[];
        pagination: IPaginationContract;
    }

    export interface ILanguageContract {
        system: {
            id: string;
            name: string;
            codename: string;
        };
    }

    export interface IViewContentTypeElementContract {
        type: string;
        name: string;
        codename: string;
        taxonomy_group?: string;
        options?: IElementOptionContract[];
    }

    export interface IElementContract {
        codename?: string;
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

    export interface IContentItemElementsContracts {
        [key: string]: IElementContract;
    }

    export interface ILinkContract {
        codename: string;
        type: string;
        url_slug: string;
    }

    export interface IModularContentContract {
        [key: string]: IModularContentContentItemContract;
    }

    export interface IModularContentContentItemContract {
        system: IContentItemSystemAttributesContract;
        elements: IContentItemElementsContracts;
    }

    export interface IContentItemContract {
        system: IContentItemSystemAttributesContract;
        elements: IContentItemElementsContracts;
    }

    export interface IContentItemSystemAttributesContract {
        id: string;
        name: string;
        codename: string;
        type: string;
        last_modified: string;
        language: string;
        sitemap_locations: string[];
        collection: string;
        workflow_step: string;
    }

    export interface IItemsWithModularContentContract {
        items: IContentItemContract[];
        modular_content: IModularContentContract;
    }

    export interface IItemsFeedContract extends IItemsWithModularContentContract {}

    export interface IListContentItemsContract extends IItemsWithModularContentContract {
        pagination: IPaginationContract;
    }

    export interface IViewContentItemContract {
        item: IContentItemContract;
        modular_content: IModularContentContract;
    }

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

    export interface IContentTypeSystemAttributesContract {
        id: string;
        name: string;
        codename: string;
        last_modified: Date;
    }

    export interface IContentTypeContract {
        system: IContentTypeSystemAttributesContract;
        elements: IContentTypeElementsContainer;
    }

    export interface IListContentTypeContract {
        types: IContentTypeContract[];
        pagination: IPaginationContract;
    }

    export interface IViewContentTypeContract extends IContentTypeContract {}
}