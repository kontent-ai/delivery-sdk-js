import { ElementContracts, ItemContracts } from '../data-contracts';
import { ElementType } from './element-type';
export declare namespace ElementModels {
    interface IRichTextResolverData {
        html: string;
        linkedItemCodenames: string[];
        componentCodenames: string[];
    }
    interface IElementWrapper {
        propertyName: string;
        contentItemSystem: ItemContracts.IContentItemSystemAttributesContract;
        rawElement: ElementContracts.IElementContract;
    }
    interface IElement<TValue> {
        name: string;
        type: ElementType;
        value: TValue;
        rawData: ElementContracts.IElementContract;
    }
    class AssetModel {
        contract: ElementContracts.IAssetContract;
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
        /**
        * Represents Assets element
        * @constructor
        * @param {ElementContracts.IAssetContract} rawAsset - Raw asset contract
        */
        constructor(contract: ElementContracts.IAssetContract);
    }
    class MultipleChoiceOption {
        name: string;
        codename: string;
        /**
        * Represents Kentico Kontent's multiple choice option
        * @constructor
        * @param {string} name - Name of the option
        * @param {string} codename - Codename of the option
        */
        constructor(name: string, codename: string);
    }
    class TaxonomyTerm {
        name: string;
        codename: string;
        /**
       * Represents taxonomy term
       * @constructor
       * @param {string} name - Name of the taxonomy option
       * @param {string} codename - Codename of the option
       */
        constructor(name: string, codename: string);
    }
}
