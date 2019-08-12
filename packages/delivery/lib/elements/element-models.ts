import { ElementContracts, ItemContracts } from '../data-contracts';
import { ElementType } from './element-type';

export namespace ElementModels {

    export interface IElementWrapper {
        propertyName: string;
        contentItemSystem: ItemContracts.IContentItemSystemAttributesContract;
        rawElement: ElementContracts.IElementContract;
    }

    export interface IElement<TValue> {
        name: string;
        type: ElementType;
        value: TValue;
        rawData: ElementContracts.IElementContract;
    }

    export class AssetModel {

        /**
         * Name of the asset
         */
        public name: string;

        /**
         * Type of the asset
         */
        public type: string;

        /**
         * Size of the asset
         */
        public size: number;

        /**
         * Description of the asset
         */
        public description?: string;

        /**
         * Url of the asset
         */
        public url: string;

        /**
         * Width in pixels for image assets
         */
        public width?: number;

        /**
         * Height in pixels for image assets
         */
        public height?: number;

        /**
        * Represents Assets element
        * @constructor
        * @param {ElementContracts.IAssetContract} rawAsset - Raw asset contract
        */
        constructor(
            public contract: ElementContracts.IAssetContract
        ) {
            this.name = contract.name;
            this.type = contract.type;
            this.size = contract.size,
            this.description = contract.description,
            this.url = contract.url;
            this.width = contract.width;
            this.height = contract.height;
         }
    }

    export class MultipleChoiceOption {

        /**
        * Represents Kentico Cloud's multiple choice option
        * @constructor
        * @param {string} name - Name of the option
        * @param {string} codename - Codename of the option
        */
        constructor(
            public name: string,
            public codename: string
        ) { }
    }

    export class TaxonomyTerm {

        /**
       * Represents taxonomy term
       * @constructor
       * @param {string} name - Name of the taxonomy option
       * @param {string} codename - Codename of the option
       */
        constructor(
            public name: string,
            public codename: string
        ) { }
    }
}


