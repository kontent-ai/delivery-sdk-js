import { IContentTypeSystemAttributes } from '../../interfaces/type/icontent-type-system-attributes.interface';

export class ContentTypeSystemAttributes implements IContentTypeSystemAttributes {

    constructor(
        public id: string,
        public name: string,
        public codename: string,
        public last_modified: Date
    ) { }
}

