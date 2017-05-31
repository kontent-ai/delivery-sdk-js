import { IContentTypeSystemAttributes } from './icontent-type-system-attributes.interface';
import { IContentTypeElement } from './icontent-type-element.interface';

export interface IContentType {
    system: IContentTypeSystemAttributes;
    elements: IContentTypeElement[]
}