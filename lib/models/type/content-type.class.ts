import { IElement } from '../../interfaces/element/ielement.interface';
import { IContentTypeSystemAttributes } from '../../interfaces/type/icontent-type-system-attributes.interface';
import { IContentType } from '../../interfaces/type/icontent-type.interface';

export class ContentType implements IContentType {
    constructor(
        /**
         * Content type system attributes
         */
        public system: IContentTypeSystemAttributes,

        /**
         * Elements (fields) assigned to content type
         */
        public elements: IElement[]
    ) { }
}
