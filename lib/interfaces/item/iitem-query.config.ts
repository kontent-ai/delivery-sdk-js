import { ContentItem } from '../../models/item/content-item.class';
import { Link } from '../../models/item/link.class';
import { IQueryConfig } from '../common/iquery.config';

export interface IItemQueryConfig extends IQueryConfig {
    linkResolver?: (link: Link) => string;
    richTextResolver?: (contentItem: ContentItem) => string;
}
