import { HttpService } from '@kentico/kontent-core';

import { IManagementClientConfig } from '../config';
import { ContentItemContracts } from '../contracts';
import { AssetModels, ContentTypeModels, ContentTypeSnippetModels, TaxonomyModels, WorkflowModels, LanguageModels } from '../models';
import {
    AddAssetQuery,
    AddContentItemQuery,
    AddContentTypeQuery,
    AddContentTypeSnippetQuery,
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
    LanguageVariantElementsQuery,
    ListAssetsQuery,
    ListContentItemsQuery,
    ListContentTypeSnippetsQuery,
    ListContentTypesQuery,
    ListLanguageVariantsOfContentTypeQuery,
    ListLanguageVariantsOfItemQuery,
    ListTaxonomiesQuery,
    ListWorkflowStepsQuery,
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
    ViewLanguageVariantQuery,
    WorkflowStepIdentifierQuery,
    ListLanguagesQuery,
    AddLanguageQuery,
    LanguageIdentifierQuery,
    ModifyLanguageQuery,
    ViewLanguageQuery,
} from '../queries';
import { sdkInfo } from '../sdk-info.generated';
import { ContentManagementQueryService } from '../services';
import { IManagementClient } from './imanagement-client.interface';

export class ManagementClient implements IManagementClient {
    private queryService: ContentManagementQueryService;

    constructor(
        protected config: IManagementClientConfig
    ) {
        this.queryService = new ContentManagementQueryService(
            config,
            config.httpService ? config.httpService : new HttpService(),
            {
                host: sdkInfo.host,
                name: sdkInfo.name,
                version: sdkInfo.version
            });
    }

    createNewVersionOfLanguageVariant(): ContentItemIdentifierQuery<LanguageIdAndCodenameIdentifierQuery<CreateNewVersionOfLanguageVariantQuery>> {
        return new ContentItemIdentifierQuery<LanguageIdAndCodenameIdentifierQuery<CreateNewVersionOfLanguageVariantQuery>>(
            this.config, this.queryService, (
                config, queryService, contentItemIdentifier) => new LanguageIdAndCodenameIdentifierQuery<CreateNewVersionOfLanguageVariantQuery>(
                    config, queryService, (nConfig, nQueryService, languageIdentifier) => new CreateNewVersionOfLanguageVariantQuery(nConfig, nQueryService, contentItemIdentifier, languageIdentifier)
                )
        );
    }

    unpublishLanguageVariant(): ContentItemIdentifierQuery<LanguageIdAndCodenameIdentifierQuery<UnpublishLanguageVariantQuery>> {
        return new ContentItemIdentifierQuery<LanguageIdAndCodenameIdentifierQuery<UnpublishLanguageVariantQuery>>(
            this.config, this.queryService, (
                config, queryService, contentItemIdentifier) => new LanguageIdAndCodenameIdentifierQuery<UnpublishLanguageVariantQuery>(
                    config, queryService, (nConfig, nQueryService, languageIdentifier) => new UnpublishLanguageVariantQuery(nConfig, nQueryService, contentItemIdentifier, languageIdentifier)
                )
        );
    }

    cancelSheduledPublishingOfLanguageVariant(): ContentItemIdentifierQuery<LanguageIdAndCodenameIdentifierQuery<CancelScheduledPublishingOfLanguageVariantQuery>> {
        return new ContentItemIdentifierQuery<LanguageIdAndCodenameIdentifierQuery<CancelScheduledPublishingOfLanguageVariantQuery>>(
            this.config, this.queryService, (
                config, queryService, contentItemIdentifier) => new LanguageIdAndCodenameIdentifierQuery<CancelScheduledPublishingOfLanguageVariantQuery>(
                    config, queryService, (nConfig, nQueryService, languageIdentifier) => new CancelScheduledPublishingOfLanguageVariantQuery(nConfig, nQueryService, contentItemIdentifier, languageIdentifier)
                )
        );
    }

    changeWorkflowStepOfLanguageVariant(): ContentItemIdentifierQuery<LanguageIdAndCodenameIdentifierQuery<WorkflowStepIdentifierQuery<ChangeWorkflowStepOfLanguageOrVariantQuery>>> {
        return new ContentItemIdentifierQuery<LanguageIdAndCodenameIdentifierQuery<WorkflowStepIdentifierQuery<ChangeWorkflowStepOfLanguageOrVariantQuery>>>(
            this.config, this.queryService, (
                config, queryService, contentItemIdentifier) => new LanguageIdAndCodenameIdentifierQuery<WorkflowStepIdentifierQuery<ChangeWorkflowStepOfLanguageOrVariantQuery>>(
                    config, queryService, (nConfig, nQueryService, languageIdentifier) => new WorkflowStepIdentifierQuery<ChangeWorkflowStepOfLanguageOrVariantQuery>(nConfig, nQueryService, (mConfig, mQueryservice, workflowIdentifier) => {
                        return new ChangeWorkflowStepOfLanguageOrVariantQuery(config, queryService, contentItemIdentifier, languageIdentifier, workflowIdentifier);
                    }
                    )
                ));
    }

    publishOrScheduleLanguageVariant(): ContentItemIdentifierQuery<LanguageIdAndCodenameIdentifierQuery<DataQuery<PublishOrScheduleLanguageVariantQuery, WorkflowModels.IPublishOrSchedulePublishData>>> {
        return new ContentItemIdentifierQuery<LanguageIdAndCodenameIdentifierQuery<DataQuery<PublishOrScheduleLanguageVariantQuery, WorkflowModels.IPublishOrSchedulePublishData>>>(
            this.config, this.queryService, (
                config, queryService, contentItemIdentifier) => new LanguageIdAndCodenameIdentifierQuery<DataQuery<PublishOrScheduleLanguageVariantQuery, WorkflowModels.IPublishOrSchedulePublishData>>(
                    config, queryService, (nConfig, nQueryService, languageIdentifier) => new DataQuery<PublishOrScheduleLanguageVariantQuery, WorkflowModels.IPublishOrSchedulePublishData>(nConfig, nQueryService, (
                        pConfig, pQueryService, data) => new PublishOrScheduleLanguageVariantQuery(pConfig, pQueryService, contentItemIdentifier, languageIdentifier, data)
                    ))
        );
    }

    listWorkflowSteps(): ListWorkflowStepsQuery {
        return new ListWorkflowStepsQuery(
            this.config,
            this.queryService,
        );
    }

    listContentTypeSnippets(): ListContentTypeSnippetsQuery {
        return new ListContentTypeSnippetsQuery(
            this.config,
            this.queryService,
        );
    }

    viewContentTypeSnippet(): ContentTypeIdentifierQuery<ViewContentTypeSnippetQuery> {
        return new ContentTypeIdentifierQuery<ViewContentTypeSnippetQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier) => new ViewContentTypeSnippetQuery(config, queryService, identifier)
        );
    }

    deleteContentTypeSnippet(): ContentTypeIdentifierQuery<DeleteContentTypeSnippetQuery> {
        return new ContentTypeIdentifierQuery<DeleteContentTypeSnippetQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier) => new DeleteContentTypeSnippetQuery(config, queryService, identifier)
        );
    }

    addContentTypeSnippet(): DataQuery<AddContentTypeSnippetQuery, ContentTypeSnippetModels.IAddContentTypeSnippetData> {
        return new DataQuery<AddContentTypeSnippetQuery, ContentTypeSnippetModels.IAddContentTypeSnippetData>(
            this.config,
            this.queryService,
            (config, queryService, data) => new AddContentTypeSnippetQuery(config, queryService, data)
        );
    }

    viewLanguageVariant(): ContentItemIdentifierQuery<LanguageIdAndCodenameIdentifierQuery<ViewLanguageVariantQuery>> {
        return new ContentItemIdentifierQuery<LanguageIdAndCodenameIdentifierQuery<ViewLanguageVariantQuery>>(
            this.config, this.queryService, (
                config, queryService, contentItemIdentifier) => new LanguageIdAndCodenameIdentifierQuery<ViewLanguageVariantQuery>(
                    config, queryService, (nConfig, nQueryService, languageIdentifier) => new ViewLanguageVariantQuery(nConfig, nQueryService, contentItemIdentifier, languageIdentifier)
                )
        );
    }

    upsertLanguageVariant(): ContentItemIdentifierQuery<LanguageIdAndCodenameIdentifierQuery<LanguageVariantElementsQuery<UpsertLanguageVariantQuery>>> {
        return new ContentItemIdentifierQuery<LanguageIdAndCodenameIdentifierQuery<LanguageVariantElementsQuery<UpsertLanguageVariantQuery>>>(
            this.config, this.queryService, (
                config, queryService, contentItemIdentifier) => new LanguageIdAndCodenameIdentifierQuery<LanguageVariantElementsQuery<UpsertLanguageVariantQuery>>(
                    config, queryService, (nConfig, nQueryService, languageIdentifier) => new LanguageVariantElementsQuery(nConfig, nQueryService, (
                        mConfig, mQueryService, elements) => new UpsertLanguageVariantQuery(mConfig, mQueryService, contentItemIdentifier, languageIdentifier, elements)
                    )
                )
        );
    }

    validateProjectContent(): ProjectIdIdentifierQuery<ValidateProjectContentQuery> {
        return new ProjectIdIdentifierQuery<ValidateProjectContentQuery>(
            this.config,
            this.queryService,
            (config, queryService, projectId) => new ValidateProjectContentQuery(config, queryService, projectId)
        );
    }

    deleteContentType(): ContentTypeIdentifierQuery<DeleteContentTypeQuery> {
        return new ContentTypeIdentifierQuery<DeleteContentTypeQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier) => new DeleteContentTypeQuery(config, queryService, identifier)
        );
    }

    addContentType(): DataQuery<AddContentTypeQuery, ContentTypeModels.IAddContentTypeData> {
        return new DataQuery<AddContentTypeQuery, ContentTypeModels.IAddContentTypeData>(
            this.config,
            this.queryService,
            (config, queryService, data) => new AddContentTypeQuery(config, queryService, data)
        );
    }

    viewContentType(): ContentTypeIdentifierQuery<ViewContentTypeQuery> {
        return new ContentTypeIdentifierQuery<ViewContentTypeQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier) => new ViewContentTypeQuery(config, queryService, identifier)
        );
    }

    listContentTypes(): ListContentTypesQuery {
        return new ListContentTypesQuery(
            this.config,
            this.queryService
        );
    }

    deleteTaxonomy(): TaxonomyIdentifierQuery<DeleteTaxonomyQuery> {
        return new TaxonomyIdentifierQuery<DeleteTaxonomyQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier) => new DeleteTaxonomyQuery(config, queryService, identifier)
        );
    }

    addTaxonomy(): DataQuery<AddTaxonomyQuery, TaxonomyModels.IAddTaxonomyRequestModel> {
        return new DataQuery<AddTaxonomyQuery, TaxonomyModels.IAddTaxonomyRequestModel>(
            this.config,
            this.queryService,
            (config, queryService, data) => new AddTaxonomyQuery(config, queryService, data)
        );
    }

    listTaxonomies(): ListTaxonomiesQuery {
        return new ListTaxonomiesQuery(
            this.config,
            this.queryService
        );
    }

    deleteAsset(): AssetIdentifierQueryClass<DeleteAssetQuery> {
        return new AssetIdentifierQueryClass<DeleteAssetQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier) => new DeleteAssetQuery(config, queryService, identifier)
        );
    }

    upsertAsset(): DataQuery<UpsertAssetQuery, AssetModels.IUpsertAssetRequestData> {
        return new DataQuery<UpsertAssetQuery, AssetModels.IUpsertAssetRequestData>(
            this.config,
            this.queryService,
            (config, queryService, data) => new UpsertAssetQuery(config, queryService, data)
        );
    }

    updateAsset(): DataQuery<UpdateAssetQuery, AssetModels.IUpdateAssetRequestData> {
        return new DataQuery<UpdateAssetQuery, AssetModels.IUpdateAssetRequestData>(
            this.config,
            this.queryService,
            (config, queryService, data) => new UpdateAssetQuery(config, queryService, data)
        );
    }

    addAsset(): DataQuery<AddAssetQuery, AssetModels.IAddAssetRequestData> {
        return new DataQuery<AddAssetQuery, AssetModels.IAddAssetRequestData>(
            this.config,
            this.queryService,
            (config, queryService, data) => new AddAssetQuery(config, queryService, data)
        );
    }

    uploadBinaryFile(): DataQuery<UploadBinaryFileQuery, AssetModels.IUploadBinaryFileRequestData> {
        return new DataQuery<UploadBinaryFileQuery, AssetModels.IUploadBinaryFileRequestData>(
            this.config,
            this.queryService,
            (config, queryService, data) => new UploadBinaryFileQuery(config, queryService, data)
        );
    }

    viewAsset(): AssetIdentifierQueryClass<ViewAssetsQuery> {
        return new AssetIdentifierQueryClass<ViewAssetsQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier) => new ViewAssetsQuery(config, queryService, identifier)
        );
    }

    listAssets(): ListAssetsQuery {
        return new ListAssetsQuery(
            this.config,
            this.queryService
        );
    }

    listContentItems(): ListContentItemsQuery {
        return new ListContentItemsQuery(
            this.config,
            this.queryService,
        );
    }

    viewContentItem(): ContentItemIdentifierQuery<ViewContentItemQuery> {
        return new ContentItemIdentifierQuery<ViewContentItemQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier) => new ViewContentItemQuery(config, queryService, identifier)
        );
    }

    addContentItem(): DataQuery<AddContentItemQuery, ContentItemContracts.IAddContentItemPostContract> {
        return new DataQuery<AddContentItemQuery, ContentItemContracts.IAddContentItemPostContract>(
            this.config,
            this.queryService,
            (config, queryService, data) => new AddContentItemQuery(config, queryService, data)
        );
    }

    updateContentItem(): ContentItemIdentifierQuery<DataQuery<UpdateContentItemQuery, ContentItemContracts.IUpdateContentItemPostContract>> {
        return new ContentItemIdentifierQuery<DataQuery<UpdateContentItemQuery, ContentItemContracts.IUpdateContentItemPostContract>>(
            this.config, this.queryService, (
                config, queryService, identifier) => new DataQuery<UpdateContentItemQuery, ContentItemContracts.IUpdateContentItemPostContract>(
                    config, queryService, (nConfig, nQueryService, data) => new UpdateContentItemQuery(nConfig, nQueryService, data, identifier)
                )
        );
    }

    upsertContentItem(): ContentItemExternalIdIdentifierQuery<DataQuery<UpsertContentItemQuery, ContentItemContracts.IUpsertContentItemPostContract>> {
        return new ContentItemExternalIdIdentifierQuery<DataQuery<UpsertContentItemQuery, ContentItemContracts.IUpsertContentItemPostContract>>(
            this.config, this.queryService, (
                config, queryService, identifier) => new DataQuery<UpsertContentItemQuery, ContentItemContracts.IUpsertContentItemPostContract>(
                    config, queryService, (nConfig, nQueryService, data) => new UpsertContentItemQuery(nConfig, nQueryService, data, identifier)
                )
        );
    }

    deleteContentItem(): ContentItemIdentifierQuery<DeleteContentItemQuery> {
        return new ContentItemIdentifierQuery<DeleteContentItemQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier) => new DeleteContentItemQuery(config, queryService, identifier)
        );
    }

    listLanguageVariantsOfItem(): ContentItemIdentifierQuery<ListLanguageVariantsOfItemQuery> {
        return new ContentItemIdentifierQuery<ListLanguageVariantsOfItemQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier) => new ListLanguageVariantsOfItemQuery(config, queryService, identifier)
        );
    }

    listLanguageVariantsOfContentType(): ContentTypeCodenameAndExternalIdIdentifierQuery<ListLanguageVariantsOfContentTypeQuery> {
        return new ContentTypeCodenameAndExternalIdIdentifierQuery<ListLanguageVariantsOfContentTypeQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier) => new ListLanguageVariantsOfContentTypeQuery(config, queryService, identifier)
        );
    }

    listLanguages(): ListLanguagesQuery {
        return new ListLanguagesQuery(
            this.config,
            this.queryService,
        );
    }

    viewLanguage(): LanguageIdentifierQuery<ViewLanguageQuery> {
        return new LanguageIdentifierQuery<ViewLanguageQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier) => new ViewLanguageQuery(config, queryService, identifier)
        );
    }

    addLanguage(): DataQuery<AddLanguageQuery, LanguageModels.IAddLanguageData> {
        return new DataQuery<AddLanguageQuery, LanguageModels.IAddLanguageData>(
            this.config,
            this.queryService,
            (config, queryService, data) => new AddLanguageQuery(config, queryService, data)
        );
    }

    modifyLanguage(): LanguageIdentifierQuery<DataQuery<ModifyLanguageQuery, LanguageModels.IModifyLanguageData[]>> {
        return new LanguageIdentifierQuery<DataQuery<ModifyLanguageQuery, LanguageModels.IModifyLanguageData[]>>(
            this.config, this.queryService, (
                config, queryService, identifier) => new DataQuery<ModifyLanguageQuery, LanguageModels.IModifyLanguageData[]>(
                    config, queryService, (nConfig, nQueryService, data) => new ModifyLanguageQuery(nConfig, nQueryService, identifier, data)
                )
        );
    }

}
