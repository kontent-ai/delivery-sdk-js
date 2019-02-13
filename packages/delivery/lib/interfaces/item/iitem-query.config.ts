import { ItemContracts } from '../../data-contracts/item-contracts';
import { FieldContracts } from '../../fields/field-contracts';
import { ContentItem } from '../../models/item/content-item.class';
import { RichTextImage } from '../../models/item/image.class';
import { Link } from '../../models/item/link.class';
import { IQueryConfig } from '../common/iquery.config';
import { ILinkResolverContext } from './ilink-resolver-context';
import { ILinkResolverResult } from './ilink-resolver-result';
import { IRichTextResolverContext } from './irich-text-resolver-context';
import { IRichTextImageResolverResult } from './irich-text-resolver-result';

export interface IItemQueryConfig extends IQueryConfig {
  throwErrorForMissingLinkedItems?: boolean;
  linkResolver?: (link: Link, context: ILinkResolverContext) => string | undefined | ILinkResolverResult;
  richTextResolver?: (contentItem: ContentItem, context: IRichTextResolverContext) => string;
  itemResolver?: (field: FieldContracts.IFieldContract, rawItem: ItemContracts.IContentItemContract, modularContent: any, queryConfig: IItemQueryConfig, ) => ContentItem | undefined;
  /**
  * Function used to resolve images inside rich text field
  */
  richTextImageResolver?: (image: RichTextImage, fieldName: string) => IRichTextImageResolverResult;
}
