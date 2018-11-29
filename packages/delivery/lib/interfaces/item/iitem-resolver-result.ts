import { ContentItem } from '../../models/item/content-item.class';

export interface IItemResolverResult<TItem extends ContentItem> {
    item: TItem | undefined;
    useOriginalResolver: boolean;
}
