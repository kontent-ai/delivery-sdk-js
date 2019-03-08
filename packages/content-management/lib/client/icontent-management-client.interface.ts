import { ContentItemContracts } from '../contracts';
import { AssetModels, ContentTypeModels, TaxonomyModels } from '../models';
import {
    AddAssetQuery,
    AddContentItemQuery,
    AddContentTypeQuery,
    AddTaxonomyQuery,
    AssetIdentifierQueryClass,
    ChangeWorkflowStepOfLanguageOrVariantQuery,
    DataQuery,
    DeleteAssetQuery,
    DeleteContentItemQuery,
    DeleteContentTypeQuery,
    DeleteTaxonomyQuery,
    ContentItemIdentifierQuery,
    IdCodenameIdentifierQuery,
    LanguageIdentifierQuery,
    LanguageVariantElementsQuery,
    ListAssetsQuery,
    ListContentItemsQuery,
    ListContentTypeSnippetsQuery,
    ListContentTypesQuery,
    ListLanguageVariantsQuery,
    ListTaxonomiesQuery,
    ListWorkflowStepsQuery,
    ProjectIdIdentifierQuery,
    PublishOrScheduleLanguageVariantQuery,
    TaxonomyIdentifierQuery,
    UpdateAssetQuery,
    UpdateContentItemQuery,
    UploadBinaryFileQuery,
    UpsertAssetQuery,
    UpsertLanguageVariantQuery,
    ValidateProjectContentQuery,
    ViewAssetsQuery,
    ViewContentItemQuery,
    ViewContentTypeQuery,
    ViewContentTypeSnippetQuery,
    ViewLanguageVariantQuery,
    WorkflowStepIdentifierQuery,
} from '../queries';

export interface IContentManagementClient {

    /**
     * Change the workflow of the specified language variant to the specified workflow step. Equivalent to the UI operation of updating workflow.
     */
    changeWorkflowStepOfLanguageVariant():  ContentItemIdentifierQuery<LanguageIdentifierQuery<WorkflowStepIdentifierQuery<ChangeWorkflowStepOfLanguageOrVariantQuery>>>;

    /**
     * Change the workflow step of the specified language variant to "Published" or schedule publishing at the specified time.
     */
    publishOrScheduleLanguageVariant(): ContentItemIdentifierQuery<LanguageIdentifierQuery<PublishOrScheduleLanguageVariantQuery>>;

    /**
     * Query to list all workflow steps in project
     */
    listWorkflowSteps(): ListWorkflowStepsQuery;

    /**
     * Query to view content type snippet
     */
    viewContentTypeSnippet(): IdCodenameIdentifierQuery<ViewContentTypeSnippetQuery>;

    /**
     * Query to list content types
     */
    listContentTypeSnippets(): ListContentTypeSnippetsQuery;

    /**
     * Query to view language variant
     */
    viewLanguageVariant(): ContentItemIdentifierQuery<LanguageIdentifierQuery<ViewLanguageVariantQuery>>;

    /**
    * Query to upsert language variant
    */
    upsertLanguageVariant(): ContentItemIdentifierQuery<LanguageIdentifierQuery<LanguageVariantElementsQuery<UpsertLanguageVariantQuery>>>;

    /**
     * Query to validate project content
     */
    validateProjectContent(): ProjectIdIdentifierQuery<ValidateProjectContentQuery>;

    /**
     * Query to view content type
     */
    deleteContentType(): IdCodenameIdentifierQuery<DeleteContentTypeQuery>;

    /**
     * Query to add new content type
     */
    addContentType(): DataQuery<AddContentTypeQuery, ContentTypeModels.IAddContentTypeData>;

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
    deleteTaxonomy(): TaxonomyIdentifierQuery<DeleteTaxonomyQuery>;

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
    deleteAsset(): AssetIdentifierQueryClass<DeleteAssetQuery>;

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
    viewAsset(): AssetIdentifierQueryClass<ViewAssetsQuery>;

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
    viewContentItem(): ContentItemIdentifierQuery<ViewContentItemQuery>;

    /**
    * Add content item query
    */
    addContentItem(): DataQuery<AddContentItemQuery, ContentItemContracts.IAddContentItemPostContract>;

    /**
     * Update content item query
     */
    updateContentItem(): ContentItemIdentifierQuery<DataQuery<UpdateContentItemQuery, ContentItemContracts.IUpdateContentItemPostContract>>;

    /**
     * Delete content item query
     */
    deleteContentItem(): ContentItemIdentifierQuery<DeleteContentItemQuery>;

    /**
     * List language variants query
     */
    listLanguageVariants(): ContentItemIdentifierQuery<ListLanguageVariantsQuery>;
}
