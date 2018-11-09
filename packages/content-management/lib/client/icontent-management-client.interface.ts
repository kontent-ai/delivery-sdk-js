import { ContentItemContracts } from '../contracts';
import {
    AddContentItemQuery,
    DeleteContentItemQueryInit,
    ListContentItemsQuery,
    UpdateContentItemQueryInit,
    ViewContentItemQueryInit,
} from '../queries';

export interface IContentManagementClient {

    /**
     * Gets list of content items query
     */
    listContentItems(): ListContentItemsQuery;

    /**
     * Gets view content item query
     */
    viewContentItem(): ViewContentItemQueryInit;

    /**
     * Gets add content item query
     */
    addContentItem(item: ContentItemContracts.IAddContentItemPostContract): AddContentItemQuery;

    /**
     * Gets update content item query
     */
    updateContentItem(item: ContentItemContracts.IUpdateContentItemPostContract): UpdateContentItemQueryInit;

    /**
     * Gets delete content item query
     */
    deleteContentItem(): DeleteContentItemQueryInit;
}
