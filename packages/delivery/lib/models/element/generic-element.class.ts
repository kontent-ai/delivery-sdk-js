import { GenericElementOption } from './generic-element-option.class';

export class GenericElement {

    /**
     * Indexer
     */
    [key: string]: any;

    /**
     * Codename of the element
     */
    public codename!: string;

    /**
     * Type of the element
     */
    public type!: string;

    /**
     * Name of the element
     */
    public name!: string;

    /**
     * Taxonomy group in case the element is a taxonomy
     */
    public taxonomyGroup?: string;

    /**
     * Array of options if the element has some
     */
    public options: GenericElementOption[] = [];

    constructor(
        data: {
            codename: string,
            type: string,
            name: string,
            taxonomyGroup?: string,
            options: GenericElementOption[]
        }
    ) {
        Object.assign(this, data);
    }
}
