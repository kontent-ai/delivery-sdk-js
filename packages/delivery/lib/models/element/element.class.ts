import { ElementOption } from './element-option.class';

export class Element {
    /**
     * Codename of the element
     */
    public codename: string;

    /**
     * Type of the element
     */
    public type: string;

    /**
     * Name of the element
     */
    public name: string;

    /**
     * Taxonomy group in case the element is a taxonomy
     */
    public taxonomyGroup?: string;

    /**
     * Array of options if the field has some
     */
    public options: ElementOption[] = [];

    constructor(
        data: {
            codename: string,
            type: string,
            name: string,
            taxonomyGroup?: string,
            options: ElementOption[]
        }
    ) {
        Object.assign(this, data);
    }
}
