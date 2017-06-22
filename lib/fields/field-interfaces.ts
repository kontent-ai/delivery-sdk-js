import { FieldType } from './field-type';

export namespace FieldInterfaces {
    
    export interface IField {
        name: string;
        type: FieldType;
        value: any;
        modular_content?: string[];
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
}