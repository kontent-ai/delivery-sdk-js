import { ContentItemContracts } from '../contracts';
import {
    AddContentItemQuery,
    DeleteContentItemQueryInit,
    ListContentItemsQuery,
    UpdateContentItemQueryInit,
    ViewContentItemQueryInit,
    ListLanguageVariantsQueryInit,
} from '../queries';

export interface IContentManagementClient {

    /**
     * List of content items query
     */
    listContentItems(): ListContentItemsQuery;

    /**
     *Ciew content item query
     */
    viewContentItem(): ViewContentItemQueryInit;

    /**
     * Add content item query
     */
    addContentItem(item: ContentItemContracts.IAddContentItemPostContract): AddContentItemQuery;

    /**
     * Update content item query
     */
    updateContentItem(item: ContentItemContracts.IUpdateContentItemPostContract): UpdateContentItemQueryInit;

    /**
     * Delete content item query
     */
    deleteContentItem(): DeleteContentItemQueryInit;

    /**
     * List language variants query
     */
    listLanguageVariants(): ListLanguageVariantsQueryInit;
}
