import { IContentItemSystemAttributes } from './icontent-item-system-attributes.interface';

export interface IContentItem {
  system: IContentItemSystemAttributes;
  elements: any;

  resolver?: ((fieldName: string) => string);
}

