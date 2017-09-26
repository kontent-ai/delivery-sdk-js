import { IElement } from '../../interfaces/element/ielement.interface';
import { IElementOption } from '../../interfaces/element/ielement-option.interface';

export class Element implements IElement{
    constructor(
        /**
         * Codename of the element
         */
        public codename: string,

        /**
         * Type of the element
         */
        public type: string,

        /**
         * Name of the element
         */
        public name: string,

        /**
         * Taxonomy group in case the element is a taxonomy
         */
        public taxonomyGroup?: string,

        /**
         * Array of options if the field has some
         */
        public options?: IElementOption[]
    ) { }
}