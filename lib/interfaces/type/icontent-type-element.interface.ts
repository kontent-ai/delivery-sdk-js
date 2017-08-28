import { IContentTypeOption } from './icontent-type-option.interface';

export interface IContentTypeElement {
    codename: string;
    type: string;
    name: string;
    taxonomyGroup?: string;
    options?: IContentTypeOption[];
}