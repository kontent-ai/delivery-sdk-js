"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericElement = exports.GenericElementOption = void 0;
class GenericElementOption {
    constructor(
    /**
     * Name of the option
     */
    name, 
    /**
     * Value of the option
     */
    codename) {
        this.name = name;
        this.codename = codename;
    }
}
exports.GenericElementOption = GenericElementOption;
class GenericElement {
    constructor(data) {
        /**
         * Array of options if the element has some
         */
        this.options = [];
        Object.assign(this, data);
    }
}
exports.GenericElement = GenericElement;
//# sourceMappingURL=element-models.js.map