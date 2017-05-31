import { IContentType } from '../../interfaces/type/icontent-type.interface';
import { IContentTypeSystemAttributes } from '../../interfaces/type/icontent-type-system-attributes.interface'
import { IContentTypeElement } from '../../interfaces/type/icontent-type-element.interface';

export class ContentType implements IContentType {
    constructor(
        public system: IContentTypeSystemAttributes,
        public elements: IContentTypeElement[]
    ) { }
}