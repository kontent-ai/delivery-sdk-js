import { IQueryConfig } from '../common/common-models';
export interface IElementQueryConfig extends IQueryConfig {
}
export declare class GenericElementOption {
    /**
     * Name of the option
     */
    name: string;
    /**
     * Value of the option
     */
    codename: string;
    constructor(
    /**
     * Name of the option
     */
    name: string, 
    /**
     * Value of the option
     */
    codename: string);
}
export declare class GenericElement {
    /**
     * Indexer
     */
    [key: string]: any;
    /**
     * Codename of the element
     */
    codename: string;
    /**
     * Type of the element
     */
    type: string;
    /**
     * Name of the element
     */
    name: string;
    /**
     * Taxonomy group in case the element is a taxonomy
     */
    taxonomyGroup?: string;
    /**
     * Array of options if the element has some
     */
    options: GenericElementOption[];
    constructor(data: {
        codename: string;
        type: string;
        name: string;
        taxonomyGroup?: string;
        options: GenericElementOption[];
    });
}
