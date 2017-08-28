import { IContentTypeOption } from '../../interfaces/type/icontent-type-option.interface';

export class ContentTypeOption implements IContentTypeOption{
    constructor(
        public name: string,
        public codename: string
    ){}
}