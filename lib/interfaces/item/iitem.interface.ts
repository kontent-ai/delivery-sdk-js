import { IContentItemSystemAttributes } from './icontent-item-system-attributes.interface';

export interface IItem {
  system: IContentItemSystemAttributes;
  elements: any;

  resolver?: ((fieldName: string) => string);
}

