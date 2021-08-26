"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementModels = void 0;
var ElementModels;
(function (ElementModels) {
    class AssetModel {
        /**
        * Represents Assets element
        * @constructor
        * @param {ElementContracts.IAssetContract} rawAsset - Raw asset contract
        */
        constructor(contract) {
            this.contract = contract;
            this.name = contract.name;
            this.type = contract.type;
            this.size = contract.size,
                this.description = contract.description,
                this.url = contract.url;
            this.width = contract.width;
            this.height = contract.height;
        }
    }
    ElementModels.AssetModel = AssetModel;
    class MultipleChoiceOption {
        /**
        * Represents Kentico Kontent's multiple choice option
        * @constructor
        * @param {string} name - Name of the option
        * @param {string} codename - Codename of the option
        */
        constructor(name, codename) {
            this.name = name;
            this.codename = codename;
        }
    }
    ElementModels.MultipleChoiceOption = MultipleChoiceOption;
    class TaxonomyTerm {
        /**
       * Represents taxonomy term
       * @constructor
       * @param {string} name - Name of the taxonomy option
       * @param {string} codename - Codename of the option
       */
        constructor(name, codename) {
            this.name = name;
            this.codename = codename;
        }
    }
    ElementModels.TaxonomyTerm = TaxonomyTerm;
})(ElementModels = exports.ElementModels || (exports.ElementModels = {}));
//# sourceMappingURL=element-models.js.map