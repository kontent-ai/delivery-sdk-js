import { AssetModels, ContentItemModels } from '../models';
import {
    AddAssetQuery,
    AddContentItemQueryInit,
    DeleteAssetQueryInit,
    DeleteContentItemQueryInit,
    ListAssetsQuery,
    ListContentItemsQuery,
    ListLanguageVariantsQueryInit,
    UpdateAssetQuery,
    UpdateContentItemQueryInit,
    UploadBinaryFileQuery,
    UpsertAssetQuery,
    ViewAssetsQueryInit,
    ViewContentItemQueryInit,
} from '../queries';


export interface IContentManagementClient {

    /**
     * Query to delete an asset
     */
    deleteAsset(): DeleteAssetQueryInit;

    /**
    * Query to upsert an asset from uploaded binary file
    */
    upsertAsset(data: AssetModels.IUpsertAssetRequestData): UpsertAssetQuery;

    /**
     * Query to update an asset from uploaded binary file
     */
    updateAsset(data: AssetModels.IUpdateAssetRequestData): UpdateAssetQuery;

    /**
     * Query to add an asset from uploaded binary file
     */
    addAsset(data: AssetModels.IAddAssetRequestData): AddAssetQuery;

    /**
     * Query to upload file
     */
    uploadBinaryFile(data: AssetModels.IUploadBinaryFileRequestData): UploadBinaryFileQuery;

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
