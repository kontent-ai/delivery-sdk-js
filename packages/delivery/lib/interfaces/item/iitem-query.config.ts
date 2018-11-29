import { ItemContracts } from '../../data-contracts/item-contracts';
import { FieldContracts } from '../../fields/field-contracts';
import { ContentItem } from '../../models/item/content-item.class';
import { Link } from '../../models/item/link.class';
import { IQueryConfig } from '../common/iquery.config';
import { IItemResolverResult } from './iitem-resolver-result';
import { ILinkResolverContext } from './ilink-resolver-context';
import { ILinkResolverResult } from './ilink-resolver-result';
import { IRichTextResolverContext } from './irich-text-resolver-context';

export interface IItemQueryConfig extends IQueryConfig {
  skipMissingLinkedItems?: boolean;
  linkResolver?: (link: Link, context: ILinkResolverContext) => string | undefined | ILinkResolverResult;
  richTextResolver?: (contentItem: ContentItem, context: IRichTextResolverContext) => string;
  itemResolver?: (field: FieldContracts.IRichTextField, itemCodename: string, modularContent: any, queryConfig: IItemQueryConfig, rawItem?: ItemContracts.IContentItemContract) => IItemResolverResult<ContentItem>;
}
