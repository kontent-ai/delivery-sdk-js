import { IElementOption } from '../../interfaces/element/ielement-option.interface';

export class ElementOption implements IElementOption{
    constructor(
        /**
         * Name of the option
         */
        public name: string,
        
        /**
         * Value of the option
         */
        public codename: string
    ){}
}