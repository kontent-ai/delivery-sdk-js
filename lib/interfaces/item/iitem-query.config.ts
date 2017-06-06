import { IContentItem } from './icontent-item.interface';

export interface IItemQueryConfig {
    urlSlugResolver?: (contentItem: IContentItem, urlSlug: string) => string;
    usePreviewMode?: boolean;
}