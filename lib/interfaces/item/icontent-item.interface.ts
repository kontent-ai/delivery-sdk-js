import { IContentItemSystemAttributes } from './icontent-item-system-attributes.interface';
import { IContentItem } from './icontent-item.interface';

export interface IContentItem {
  system: IContentItemSystemAttributes;
  elements: any;

  propertyResolver?: (fieldName: string) => string;
  urlSlugResolver?: (contentItem: IContentItem, urlSlug: string) => string;
  richTextResolver?: <T extends IContentItem>(contentItem: T) => string;
}

