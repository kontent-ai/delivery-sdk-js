import { ContentItem } from '../../models/item/content-item.class';
import { Link } from '../../models/item/link.class';
import { IQueryConfig } from '../common/iquery.config';
import { ILinkResolverResult } from './ilink-resolver-result';

export interface IItemQueryConfig extends IQueryConfig {
  linkResolver?: (link: Link) => string | undefined | ILinkResolverResult;
  richTextResolver?: (contentItem: ContentItem) => string;
}
