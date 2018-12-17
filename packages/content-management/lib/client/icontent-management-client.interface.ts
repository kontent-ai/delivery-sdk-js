import { AssetModels, ContentItemModels } from '../models';
import {
    AddAssetQuery,
    AddContentItemQueryInit,
    DeleteAssetQuery,
    DeleteContentItemQuery,
    FullIdentifierQuery,
    IdIdentifierQuery,
    ListAssetsQuery,
    ListContentItemsQuery,
    ListLanguageVariantsQuery,
    UpdateAssetQuery,
    UpdateContentItemQueryInit,
    UploadBinaryFileQuery,
    UpsertAssetQuery,
    ViewAssetsQuery,
    ViewContentItemQuery,
} from '../queries';


export interface IContentManagementClient {

    /**
     * Query to delete an asset
     */
    deleteAsset(): FullIdentifierQuery<DeleteAssetQuery>;

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
    viewAsset(): IdIdentifierQuery<ViewAssetsQuery>;

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
    viewContentItem(): FullIdentifierQuery<ViewContentItemQuery>;

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
    deleteContentItem(): FullIdentifierQuery<DeleteContentItemQuery>;

    /**
     * List language variants query
     */
    listLanguageVariants<TElements extends ContentItemModels.ContentItemVariantElements>(): FullIdentifierQuery<ListLanguageVariantsQuery<TElements>>;
}
