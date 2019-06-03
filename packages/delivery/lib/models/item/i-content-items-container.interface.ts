import { IContentItem } from '../../interfaces';

export interface IContentItemsContainer<TItem extends IContentItem = IContentItem> {
    [key: string]: TItem;
}
