import { IContentItemSystemAttributes } from './icontent-item-system-attributes.interface';
import { IContentItem } from './icontent-item.interface';
import { ILink } from '../../interfaces/item/ilink.interface';

export interface IContentItem {
  system: IContentItemSystemAttributes;
  elements: any;

  propertyResolver?: (fieldName: string) => string;
  linkResolver?: (link: ILink) => string;
  richTextResolver?: (contentItem: IContentItem) => string;
}

