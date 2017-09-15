import { IContentItem } from './icontent-item.interface';
import { ILink } from './ilink.interface';

export interface IItemQueryConfig {
    linkResolver?: (link: ILink) => string;
    usePreviewMode?: boolean;
    richTextResolver?: (contentItem: IContentItem) => string;
}