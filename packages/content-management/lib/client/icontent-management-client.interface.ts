import { ListContentItemsQuery, ViewContentItemQueryInit } from '../queries';

export interface IContentManagementClient {

    /**
     * Gets list of content items query
     */
    listContentItems(): ListContentItemsQuery;

    /**
     * Gets view content item query
     */
    viewContentItem(): ViewContentItemQueryInit;
}
