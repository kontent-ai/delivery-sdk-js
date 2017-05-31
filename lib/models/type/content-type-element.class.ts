import { IContentTypeElement } from '../../interfaces/type/icontent-type-element.interface';

export class ContentTypeElement implements IContentTypeElement {
    constructor(
        public type: string,
        public name: string
    ){}
}