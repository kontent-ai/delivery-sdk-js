import { HttpService } from 'kentico-cloud-core';

import { IContentManagementClientConfig } from '../config';
import { ContentItemContracts } from '../contracts';
import { AssetModels, ContentTypeModels, TaxonomyModels } from '../models';
import {
    AddAssetQuery,
    AddContentItemQuery,
    AddContentTypeQuery,
    AddTaxonomyQuery,
    AssetIdentifierQueryClass,
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
    ChangeWorkflowStepOfLanguageOrVariantQuery,
    PublishOrScheduleLanguageVariantQuery,
    WorkflowStepIdentifierQuery,
} from '../queries';
import { sdkInfo } from '../sdk-info.generated';
import { ContentManagementQueryService } from '../services';
import { IContentManagementClient } from './icontent-management-client.interface';

export class ContentManagementClient implements IContentManagementClient {
    private queryService: ContentManagementQueryService;

    constructor(
        /**
         * Tracking client configuration
         */
        protected config: IContentManagementClientConfig
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

    changeWorkflowStepOfLanguageVariant(): ContentItemIdentifierQuery<LanguageIdentifierQuery<WorkflowStepIdentifierQuery<ChangeWorkflowStepOfLanguageOrVariantQuery>>> {
        return new ContentItemIdentifierQuery<LanguageIdentifierQuery<WorkflowStepIdentifierQuery<ChangeWorkflowStepOfLanguageOrVariantQuery>>>(
            this.config, this.queryService, (
                config, queryService, contentItemIdentifier) => new LanguageIdentifierQuery<WorkflowStepIdentifierQuery<ChangeWorkflowStepOfLanguageOrVariantQuery>>(
                    config, queryService, (nConfig, nQueryService, languageIdentifier) => new WorkflowStepIdentifierQuery<ChangeWorkflowStepOfLanguageOrVariantQuery>(nConfig, nQueryService, (mConfig, mQueryservice, workflowIdentifier) => {
                        return new ChangeWorkflowStepOfLanguageOrVariantQuery(config, queryService, contentItemIdentifier, languageIdentifier, workflowIdentifier);
                    }
                    )
                ));
    }

    publishOrScheduleLanguageVariant(): ContentItemIdentifierQuery<LanguageIdentifierQuery<PublishOrScheduleLanguageVariantQuery>> {
        return new ContentItemIdentifierQuery<LanguageIdentifierQuery<PublishOrScheduleLanguageVariantQuery>>(
            this.config, this.queryService, (
                config, queryService, contentItemIdentifier) => new LanguageIdentifierQuery<PublishOrScheduleLanguageVariantQuery>(
                    config, queryService, (nConfig, nQueryService, languageIdentifier) => new PublishOrScheduleLanguageVariantQuery(nConfig, nQueryService, contentItemIdentifier, languageIdentifier)
                )
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

    viewContentTypeSnippet(): IdCodenameIdentifierQuery<ViewContentTypeSnippetQuery> {
        return new IdCodenameIdentifierQuery<ViewContentTypeSnippetQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier) => new ViewContentTypeSnippetQuery(config, queryService, identifier)
        );
    }

    viewLanguageVariant(): ContentItemIdentifierQuery<LanguageIdentifierQuery<ViewLanguageVariantQuery>> {
        return new ContentItemIdentifierQuery<LanguageIdentifierQuery<ViewLanguageVariantQuery>>(
            this.config, this.queryService, (
                config, queryService, contentItemIdentifier) => new LanguageIdentifierQuery<ViewLanguageVariantQuery>(
                    config, queryService, (nConfig, nQueryService, languageIdentifier) => new ViewLanguageVariantQuery(nConfig, nQueryService, contentItemIdentifier, languageIdentifier)
                )
        );
    }

    upsertLanguageVariant(): ContentItemIdentifierQuery<LanguageIdentifierQuery<LanguageVariantElementsQuery<UpsertLanguageVariantQuery>>> {
        return new ContentItemIdentifierQuery<LanguageIdentifierQuery<LanguageVariantElementsQuery<UpsertLanguageVariantQuery>>>(
            this.config, this.queryService, (
                config, queryService, contentItemIdentifier) => new LanguageIdentifierQuery<LanguageVariantElementsQuery<UpsertLanguageVariantQuery>>(
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

    deleteContentType(): IdCodenameIdentifierQuery<DeleteContentTypeQuery> {
        return new IdCodenameIdentifierQuery<DeleteContentTypeQuery>(
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

    viewContentType(): IdCodenameIdentifierQuery<ViewContentTypeQuery> {
        return new IdCodenameIdentifierQuery<ViewContentTypeQuery>(
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

    deleteContentItem(): ContentItemIdentifierQuery<DeleteContentItemQuery> {
        return new ContentItemIdentifierQuery<DeleteContentItemQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier) => new DeleteContentItemQuery(config, queryService, identifier)
        );
    }

    listLanguageVariants(): ContentItemIdentifierQuery<ListLanguageVariantsQuery> {
        return new ContentItemIdentifierQuery<ListLanguageVariantsQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier) => new ListLanguageVariantsQuery(config, queryService, identifier)
        );
    }
}
