import { ContentItemContracts } from '../contracts';
import { AddContentItemQuery, ListContentItemsQuery, ViewContentItemQueryInit } from '../queries';

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
     * Gets add view content item query
     */
    addContentItem(item: ContentItemContracts.IAddContentItemPostContract): AddContentItemQuery;
}
