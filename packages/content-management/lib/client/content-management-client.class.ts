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
    FullContentItemIdentifierQuery,
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

    viewLanguageVariant(): FullContentItemIdentifierQuery<LanguageIdentifierQuery<ViewLanguageVariantQuery>> {
        return new FullContentItemIdentifierQuery<LanguageIdentifierQuery<ViewLanguageVariantQuery>>(
            this.config, this.queryService, (
                config, queryService, contentItemIdentifier) => new LanguageIdentifierQuery<ViewLanguageVariantQuery>(
                    config, queryService, (nConfig, nQueryService, languageIdentifier) => new ViewLanguageVariantQuery(nConfig, nQueryService, contentItemIdentifier, languageIdentifier)
                )
        );
    }

    upsertLanguageVariant(): FullContentItemIdentifierQuery<LanguageIdentifierQuery<LanguageVariantElementsQuery<UpsertLanguageVariantQuery>>> {
        return new FullContentItemIdentifierQuery<LanguageIdentifierQuery<LanguageVariantElementsQuery<UpsertLanguageVariantQuery>>>(
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

    viewContentItem(): FullContentItemIdentifierQuery<ViewContentItemQuery> {
        return new FullContentItemIdentifierQuery<ViewContentItemQuery>(
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

    updateContentItem(): FullContentItemIdentifierQuery<DataQuery<UpdateContentItemQuery, ContentItemContracts.IUpdateContentItemPostContract>> {
        return new FullContentItemIdentifierQuery<DataQuery<UpdateContentItemQuery, ContentItemContracts.IUpdateContentItemPostContract>>(
            this.config, this.queryService, (
                config, queryService, identifier) => new DataQuery<UpdateContentItemQuery, ContentItemContracts.IUpdateContentItemPostContract>(
                    config, queryService, (nConfig, nQueryService, data) => new UpdateContentItemQuery(nConfig, nQueryService, data, identifier)
                )
        );
    }

    deleteContentItem(): FullContentItemIdentifierQuery<DeleteContentItemQuery> {
        return new FullContentItemIdentifierQuery<DeleteContentItemQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier) => new DeleteContentItemQuery(config, queryService, identifier)
        );
    }

    listLanguageVariants(): FullContentItemIdentifierQuery<ListLanguageVariantsQuery> {
        return new FullContentItemIdentifierQuery<ListLanguageVariantsQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier) => new ListLanguageVariantsQuery(config, queryService, identifier)
        );
    }
}
