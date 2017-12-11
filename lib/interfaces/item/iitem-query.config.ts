import { IContentItem } from './icontent-item.interface';
import { IQueryConfig } from '../common/iquery.config';
import { ILink } from './ilink.interface';

export interface IItemQueryConfig extends IQueryConfig {
    linkResolver?: (link: ILink) => string;
    richTextResolver?: (contentItem: IContentItem) => string;
}
