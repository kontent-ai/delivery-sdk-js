import {
  ItemLinkResolver,
  ItemResolver,
  ItemRichTextResolver,
  RichTextImageResolver,
} from '../../models/item/item-resolvers';
import { IQueryConfig } from '../common/iquery.config';

export interface IItemQueryConfig extends IQueryConfig {
  throwErrorForMissingLinkedItems?: boolean;
  linkResolver?: ItemLinkResolver;
  richTextResolver?: ItemRichTextResolver;
  itemResolver?: ItemResolver;
  richTextImageResolver?: RichTextImageResolver;
}
