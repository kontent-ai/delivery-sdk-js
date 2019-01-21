import { ContentItemContracts } from '../contracts';
import { AssetModels, TaxonomyModels } from '../models';
import {
    AddAssetQuery,
    AddContentItemQuery,
    AddTaxonomyQuery,
    DataQuery,
    DeleteAssetQuery,
    DeleteContentItemQuery,
    DeleteContentTypeQuery,
    DeleteTaxonomyQuery,
    FullIdentifierQuery,
    IdCodenameIdentifierQuery,
    IdIdentifierQuery,
    LanguageIdentifierQuery,
    LanguageVariantElementsQuery,
    ListAssetsQuery,
    ListContentItemsQuery,
    ListContentTypesQuery,
    ListLanguageVariantsQuery,
    ListTaxonomiesQuery,
    ProjectIdIdentifierQuery,
    UpdateAssetQuery,
    UpdateContentItemQuery,
    UploadBinaryFileQuery,
    UpsertAssetQuery,
    UpsertLanguageVariantQuery,
    ValidateProjectContentQuery,
    ViewAssetsQuery,
    ViewContentItemQuery,
    ViewContentTypeQuery,
    ViewLanguageVariantQuery,
} from '../queries';

export interface IContentManagementClient {

    /**
     * Query to view language variant
     */
    viewLanguageVariant(): FullIdentifierQuery<LanguageIdentifierQuery<ViewLanguageVariantQuery>>;

    /**
    * Query to upsert language variant
    */
    upsertLanguageVariant(): FullIdentifierQuery<LanguageIdentifierQuery<LanguageVariantElementsQuery<UpsertLanguageVariantQuery>>>;

    /**
     * Query to validate project content
     */
    validateProjectContent(): ProjectIdIdentifierQuery<ValidateProjectContentQuery>;

    /**
     * Query to view content type
     */
    deleteContentType(): IdCodenameIdentifierQuery<DeleteContentTypeQuery>;

    /**
     * Query to view content type
     */
    viewContentType(): IdCodenameIdentifierQuery<ViewContentTypeQuery>;

    /**
     * Query to list content types
     */
    listContentTypes(): ListContentTypesQuery;

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
     * View content item query
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
    listLanguageVariants(): FullIdentifierQuery<ListLanguageVariantsQuery>;
}
