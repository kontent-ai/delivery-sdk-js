import { IContentTypeSystemAttributes } from '../../interfaces/type/icontent-type-system-attributes.interface';

export class ContentTypeSystemAttributes implements IContentTypeSystemAttributes {

    constructor(
        /**
         * Id of the type
         */
        public id: string,

        /**
         * Name of the type
         */
        public name: string,

        /**
         * Codename of the type
         */
        public codename: string,

        /**
         * Date of last modification
         */
        public last_modified: Date
    ) { }
}

