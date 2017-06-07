import { IContentItemSystemAttributes } from './icontent-item-system-attributes.interface';
import { IContentItem } from './icontent-item.interface';

export interface IContentItem {
  system: IContentItemSystemAttributes;
  elements: any;

  resolver?: (fieldName: string) => string;
  urlSlugResolver?: (contentItem: IContentItem, urlSlug: string) => string;
  richTextModularResolver?: <T extends IContentItem>(contentItem: T) => string;
}

