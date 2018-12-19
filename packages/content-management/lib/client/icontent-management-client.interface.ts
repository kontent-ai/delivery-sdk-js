
import { ContentItemContracts } from '../contracts';
import { AssetModels, ContentItemModels, TaxonomyModels } from '../models';
import {
    AddAssetQuery,
    AddContentItemQuery,
    AddTaxonomyQuery,
    DataQuery,
    DeleteAssetQuery,
    DeleteContentItemQuery,
    FullIdentifierQuery,
    IdIdentifierQuery,
    ListAssetsQuery,
    ListContentItemsQuery,
    ListLanguageVariantsQuery,
    ListTaxonomiesQuery,
    UpdateAssetQuery,
    UpdateContentItemQuery,
    UploadBinaryFileQuery,
    UpsertAssetQuery,
    ViewAssetsQuery,
    ViewContentItemQuery,
    DeleteTaxonomyQuery
} from '../queries';


export interface IContentManagementClient {

    /**
    * Query to delete a taxonomy
    */
    deleteTaxonomy(): FullIdentifierQuery<DeleteTaxonomyQuery>;

    /**
    * Query to add a taxonomy
    */
    addTaxonomy(): DataQuery<AddTaxonomyQuery, TaxonomyModels.IAddTaxonomyRequestModel>;

    /**
     * Query to list taxonomies
     */
    listTaxonomies(): ListTaxonomiesQuery;

    /**
     * Query to delete an asset
     */
    deleteAsset(): FullIdentifierQuery<DeleteAssetQuery>;

    /**
    * Query to upsert an asset from uploaded binary file
    */
    upsertAsset(): DataQuery<UpsertAssetQuery, AssetModels.IUpsertAssetRequestData>;

    /**
     * Query to update an asset from uploaded binary file
     */
    updateAsset(): DataQuery<UpdateAssetQuery, AssetModels.IUpdateAssetRequestData>;

    /**
     * Query to add an asset from uploaded binary file
     */
    addAsset(): DataQuery<AddAssetQuery, AssetModels.IAddAssetRequestData>;

    /**
     * Query to upload file
     */
    uploadBinaryFile(): DataQuery<UploadBinaryFileQuery, AssetModels.IUploadBinaryFileRequestData>;

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
    addContentItem(): DataQuery<AddContentItemQuery, ContentItemContracts.IAddContentItemPostContract>;

    /**
     * Update content item query
     */
    updateContentItem(): FullIdentifierQuery<DataQuery<UpdateContentItemQuery, ContentItemContracts.IUpdateContentItemPostContract>>;

    /**
     * Delete content item query
     */
    deleteContentItem(): FullIdentifierQuery<DeleteContentItemQuery>;

    /**
     * List language variants query
     */
    listLanguageVariants<TElements extends ContentItemModels.ContentItemVariantElements>(): FullIdentifierQuery<ListLanguageVariantsQuery<TElements>>;
}
