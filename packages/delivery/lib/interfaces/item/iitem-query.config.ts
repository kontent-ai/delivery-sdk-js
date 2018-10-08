import { ContentItem } from '../../models/item/content-item.class';
import { Link } from '../../models/item/link.class';
import { IQueryConfig } from '../common/iquery.config';
import { ILinkResolverResult } from './ilink-resolver-result';
import { IRichTextResolverContext } from './irich-text-resolver-context';

export interface IItemQueryConfig extends IQueryConfig {
  linkResolver?: (link: Link) => string | undefined | ILinkResolverResult;
  richTextResolver?: (contentItem: ContentItem, context: IRichTextResolverContext) => string;
}
