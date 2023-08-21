import { IQueryConfig } from './common/common-models';

export interface IElementQueryConfig extends IQueryConfig {
    /**
     * No dedicated properties required at this moment
     */
}

export interface IGenericElementOption {
    /**
     * Name of the option
     */
    name: string;

    /**
     * Value of the option
     */
    codename: string;
}

export interface IGenericElement {
    /**
     * Indexer
     */
    [key: string]: any;

    /**
     * Codename of the element
     */
    codename?: string;

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
    options: IGenericElementOption[];
}
