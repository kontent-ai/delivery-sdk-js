import { ContentItemModels } from '../models';
import {
    AddContentItemQueryInit,
    DeleteContentItemQueryInit,
    ListAssetsQuery,
    ListContentItemsQuery,
    ListLanguageVariantsQueryInit,
    UpdateContentItemQueryInit,
    ViewAssetsQueryInit,
    ViewContentItemQueryInit,
} from '../queries';


export interface IContentManagementClient {

    /**
     * Query to view asset
     */
    viewAsset(): ViewAssetsQueryInit;

    /**
     * Query for listing assets
     */
    listAssets(): ListAssetsQuery;

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
    addContentItem(): AddContentItemQueryInit;

    /**
     * Update content item query
     */
    updateContentItem(): UpdateContentItemQueryInit;

    /**
     * Delete content item query
     */
    deleteContentItem(): DeleteContentItemQueryInit;

    /**
     * List language variants query
     */
    listLanguageVariants<TElements extends ContentItemModels.ContentItemVariantElements>(): ListLanguageVariantsQueryInit<TElements>;
}
