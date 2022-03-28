import { IContentItemSystemAttributes } from '../models/item-models';
import { Contracts } from '../contracts';
import { ElementType } from './element-type';

export namespace ElementModels {
    export interface IRichTextResolverData {
        html: string;
        linkedItemCodenames: string[];
        componentCodenames: string[];
    }

    export interface IElementWrapper {
        element: string;
        system: IContentItemSystemAttributes;
        rawElement: Contracts.IElementContract;
    }

    export interface IElement<TValue> {
        /**
         * Name of the element
         */
        name: string;

        /**
         * Element type
         */
        type: ElementType;

        /**
         * Element value
         */
        value: TValue;
    }

    export interface AssetModel {
        /**
         * Name of the asset
         */
        name: string;

        /**
         * Type of the asset
         */
        type: string;

        /**
         * Size of the asset
         */
        size: number;

        /**
         * Description of the asset
         */
        description: string | null;

        /**
         * Url of the asset
         */
        url: string;

        /**
         * Width in pixels for image assets
         */
        width: number | null;

        /**
         * Height in pixels for image assets
         */
        height: number | null;

        /**
         * Dictionary with rendition preset codenames as keys and respective renditions as values.
         */
        renditions: { [renditionPresetCodename: string]: Rendition } | null;
    }

    export interface Rendition {
        rendition_id: string;
        preset_id: string;
        width: number;
        height: number;
        query: string;
        url: string;
    }

    export interface MultipleChoiceOption {
        name: string;
        codename: string;
    }

    export interface TaxonomyTerm<TaxonomyCodename extends string = string> {
        name: string;
        codename: TaxonomyCodename;
    }
}
