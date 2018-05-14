import { FieldType } from './field-type';

export namespace FieldInterfaces {

    export interface IField {
        name: string;
        type: string;
        value: any;
        taxonomy_group?: string;
    }

    export interface IAsset {
        name: string;
        type: string;
        size: number;
        description: string;
        url: string;
    }

    export interface IMultipleChoiceOption {
        name: string;
        codename: string;
    }

    export interface ITaxonomyTerm {
        name: string;
        codename: string;
    }

    export interface IRichTextField extends IField {

        /**
         * Modular content items
         */
        modular_content?: string[];

        /**
         * Json with links identified by item Id
         */
        links: any;
    }
}
