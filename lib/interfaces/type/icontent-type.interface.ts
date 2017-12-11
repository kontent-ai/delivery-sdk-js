import { IContentTypeSystemAttributes } from './icontent-type-system-attributes.interface';
import { IElement } from '../element/ielement.interface';

export interface IContentType {
    system: IContentTypeSystemAttributes;
    elements: IElement[]
}
