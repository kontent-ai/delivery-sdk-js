import { ContentItemContracts } from '../contracts';
import {
    AssetModels,
    ContentTypeModels,
    ContentTypeSnippetModels,
    LanguageModels,
    TaxonomyModels,
    WorkflowModels,
} from '../models';
import {
    AddAssetQuery,
    AddContentItemQuery,
    AddContentTypeQuery,
    AddContentTypeSnippetQuery,
    AddLanguageQuery,
    AddTaxonomyQuery,
    AssetIdentifierQueryClass,
    CancelScheduledPublishingOfLanguageVariantQuery,
    ChangeWorkflowStepOfLanguageOrVariantQuery,
    ContentItemExternalIdIdentifierQuery,
    ContentItemIdentifierQuery,
    ContentTypeCodenameAndExternalIdIdentifierQuery,
    ContentTypeIdentifierQuery,
    CreateNewVersionOfLanguageVariantQuery,
    DataQuery,
    DeleteAssetQuery,
    DeleteContentItemQuery,
    DeleteContentTypeQuery,
    DeleteContentTypeSnippetQuery,
    DeleteTaxonomyQuery,
    LanguageIdAndCodenameIdentifierQuery,
    LanguageIdentifierQuery,
    LanguageVariantElementsQuery,
    ListAssetsQuery,
    ListContentItemsQuery,
    ListContentTypeSnippetsQuery,
    ListContentTypesQuery,
    ListLanguagesQuery,
    ListLanguageVariantsOfContentTypeQuery,
    ListLanguageVariantsOfItemQuery,
    ListTaxonomiesQuery,
    ListWorkflowStepsQuery,
    ModifyLanguageQuery,
    ProjectIdIdentifierQuery,
    PublishOrScheduleLanguageVariantQuery,
    TaxonomyIdentifierQuery,
    UnpublishLanguageVariantQuery,
    UpdateAssetQuery,
    UpdateContentItemQuery,
    UploadBinaryFileQuery,
    UpsertAssetQuery,
    UpsertContentItemQuery,
    UpsertLanguageVariantQuery,
    ValidateProjectContentQuery,
    ViewAssetsQuery,
    ViewContentItemQuery,
    ViewContentTypeQuery,
    ViewContentTypeSnippetQuery,
    ViewLanguageQuery,
    ViewLanguageVariantQuery,
    WorkflowStepIdentifierQuery,
} from '../queries';

export interface IManagementClient {
    /**
     * Create a new version of a published language variant while keeping the original version published and available through Delivery API. Equivalent to the UI action of creating new versions of content.
     */
    createNewVersionOfLanguageVariant(): ContentItemIdentifierQuery<
        LanguageIdAndCodenameIdentifierQuery<CreateNewVersionOfLanguageVariantQuery>
    >;

    /**
     * Unpublish a language variant to make it no longer accessible through Delivery API. Equivalent to the UI action of unpublishing content.
     * You can only unpublish language variants that are published and don't already have a Draft (unpublished) version.
     */
    unpublishLanguageVariant(): ContentItemIdentifierQuery<
        LanguageIdAndCodenameIdentifierQuery<UnpublishLanguageVariantQuery>
    >;

    /**
     * Cancel scheduling of a language variant. Equivalent to the UI action of canceling scheduled content. If the language variant is not scheduled, nothing happens.
     */
    cancelSheduledPublishingOfLanguageVariant(): ContentItemIdentifierQuery<
        LanguageIdAndCodenameIdentifierQuery<CancelScheduledPublishingOfLanguageVariantQuery>
    >;

    /**
     * Change the workflow of the specified language variant to the specified workflow step. Equivalent to the UI operation of updating workflow.
     */
    changeWorkflowStepOfLanguageVariant(): ContentItemIdentifierQuery<
        LanguageIdAndCodenameIdentifierQuery<WorkflowStepIdentifierQuery<ChangeWorkflowStepOfLanguageOrVariantQuery>>
    >;

    /**
     * Change the workflow step of the specified language variant to "Published" or schedule publishing at the specified time.
     */
    publishOrScheduleLanguageVariant(): ContentItemIdentifierQuery<
        LanguageIdAndCodenameIdentifierQuery<
            DataQuery<PublishOrScheduleLanguageVariantQuery, WorkflowModels.IPublishOrSchedulePublishData>
        >
    >;

    /**
     * Query to list all workflow steps in project
     */
    listWorkflowSteps(): ListWorkflowStepsQuery;

    /**
     * Query to view content type snippet
     */
    viewContentTypeSnippet(): ContentTypeIdentifierQuery<ViewContentTypeSnippetQuery>;

    /**
     * Query to list content types
     */
    listContentTypeSnippets(): ListContentTypeSnippetsQuery;

    /**
     * Query to delete content type snippet
     */
    deleteContentTypeSnippet(): ContentTypeIdentifierQuery<DeleteContentTypeSnippetQuery>;

    /**
     * Query to add new content type snippet
     */
    addContentTypeSnippet(): DataQuery<AddContentTypeSnippetQuery, ContentTypeSnippetModels.IAddContentTypeSnippetData>;

    /**
     * Query to view language variant
     */
    viewLanguageVariant(): ContentItemIdentifierQuery<LanguageIdAndCodenameIdentifierQuery<ViewLanguageVariantQuery>>;

    /**
     * Query to upsert language variant
     */
    upsertLanguageVariant(): ContentItemIdentifierQuery<
        LanguageIdAndCodenameIdentifierQuery<LanguageVariantElementsQuery<UpsertLanguageVariantQuery>>
    >;

    /**
     * Query to validate project content
     */
    validateProjectContent(): ProjectIdIdentifierQuery<ValidateProjectContentQuery>;

    /**
     * Query to delete content type
     */
    deleteContentType(): ContentTypeIdentifierQuery<DeleteContentTypeQuery>;

    /**
     * Query to add new content type
     */
    addContentType(): DataQuery<AddContentTypeQuery, ContentTypeModels.IAddContentTypeData>;

    /**
     * Query to view content type
     */
    viewContentType(): ContentTypeIdentifierQuery<ViewContentTypeQuery>;

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
    updateContentItem(): ContentItemIdentifierQuery<
        DataQuery<UpdateContentItemQuery, ContentItemContracts.IUpdateContentItemPostContract>
    >;

    /**
     * Upsert content item query
     */
    upsertContentItem(): ContentItemExternalIdIdentifierQuery<
        DataQuery<UpsertContentItemQuery, ContentItemContracts.IUpsertContentItemPostContract>
    >;

    /**
     * Delete content item query
     */
    deleteContentItem(): ContentItemIdentifierQuery<DeleteContentItemQuery>;

    /**
     * List language variants of a specific content item query
     */
    listLanguageVariantsOfItem(): ContentItemIdentifierQuery<ListLanguageVariantsOfItemQuery>;

    /**
     * List language variants of a specific content type query
     */
    listLanguageVariantsOfContentType(): ContentTypeCodenameAndExternalIdIdentifierQuery<
        ListLanguageVariantsOfContentTypeQuery
    >;

    /**
     * List languages in project
     */
    listLanguages(): ListLanguagesQuery;

    /**
     * View language
     */
    viewLanguage(): LanguageIdentifierQuery<ViewLanguageQuery>;

    /**
     * Adds new language
     */
    addLanguage(): DataQuery<AddLanguageQuery, LanguageModels.IAddLanguageData>;

    /**
     * Modifies existing language
     */
    modifyLanguage(): LanguageIdentifierQuery<DataQuery<ModifyLanguageQuery, LanguageModels.IModifyLanguageData[]>>;
}
