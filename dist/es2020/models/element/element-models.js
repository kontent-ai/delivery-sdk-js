export class GenericElementOption {
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
export class GenericElement {
    constructor(data) {
        /**
         * Array of options if the element has some
         */
        this.options = [];
        Object.assign(this, data);
    }
}
//# sourceMappingURL=element-models.js.map