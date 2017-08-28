import { IContentTypeElement } from '../../interfaces/type/icontent-type-element.interface';
import { IContentTypeOption } from '../../interfaces/type/icontent-type-option.interface';

export class ContentTypeElement implements IContentTypeElement{
    constructor(
        public codename: string,
        public type: string,
        public name: string,
        public taxonomyGroup?: string,
        public options?: IContentTypeOption[]
    ) { }
}