import { FieldInterfaces} from './field-interfaces';

export namespace FieldModels {
    
    export class AssetModel implements FieldInterfaces.IAsset {

        /**
        * Represents Kentico Cloud's asset
        * @constructor
        * @param {string} name - Name of the asset
        * @param {string} type - Type of the asset
        * @param {number} size - Size of the asset
        * @param {string} description - Description of the asset
        * @param {string} url - Url of the asset 
        */
        constructor(
            public name: string,
            public type: string,
            public size: number,
            public description: string,
            public url: string,
        ) { }
    }

    export class MultipleChoiceOption implements FieldInterfaces.IMultipleChoiceOption {

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

    export class TaxonomyTerm implements FieldInterfaces.ITaxonomyTerm {

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


