import { IContentItemSystemAttributes } from '../models/item-models';
import { Contracts } from '../data-contracts';
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
        description?: string;

        /**
         * Url of the asset
         */
        url: string;

        /**
         * Width in pixels for image assets
         */
        width?: number;

        /**
         * Height in pixels for image assets
         */
        height?: number;
    }

    export interface MultipleChoiceOption {
        name: string;
        codename: string;
    }

    export interface TaxonomyTerm {
        name: string;
        codename: string;
    }
}
