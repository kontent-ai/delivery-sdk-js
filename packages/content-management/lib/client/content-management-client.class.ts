import { HttpService } from 'kentico-cloud-core';

import { IContentManagementClientConfig } from '../config';
import { ContentItemContracts } from '../contracts';
import { AssetModels, TaxonomyModels, ContentTypeModels } from '../models';
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
    ListContentTypeSnippetsQuery,
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
    ViewContentTypeSnippetQuery,
    ViewLanguageVariantQuery,
    AddContentTypeQuery,
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
            (config, queryService, identifier, identifierValue) => new ViewContentTypeSnippetQuery(config, queryService, identifier, identifierValue)
        );
    }

    viewLanguageVariant(): FullIdentifierQuery<LanguageIdentifierQuery<ViewLanguageVariantQuery>> {
        return new FullIdentifierQuery<LanguageIdentifierQuery<ViewLanguageVariantQuery>>(
            this.config, this.queryService, (
                config, queryService, contentItemIdentifier, contentItemIdentifierValue) => new LanguageIdentifierQuery<ViewLanguageVariantQuery>(
                    config, queryService, (nConfig, nQueryService, languageIdentifier, languageIdentifierValue) => new ViewLanguageVariantQuery(nConfig, nQueryService, contentItemIdentifier, contentItemIdentifierValue, languageIdentifier, languageIdentifierValue)
                )
        );
    }

    upsertLanguageVariant(): FullIdentifierQuery<LanguageIdentifierQuery<LanguageVariantElementsQuery<UpsertLanguageVariantQuery>>> {
        return new FullIdentifierQuery<LanguageIdentifierQuery<LanguageVariantElementsQuery<UpsertLanguageVariantQuery>>>(
            this.config, this.queryService, (
                config, queryService, contentItemIdentifier, contentItemIdentifierValue) => new LanguageIdentifierQuery<LanguageVariantElementsQuery<UpsertLanguageVariantQuery>>(
                    config, queryService, (nConfig, nQueryService, languageIdentifier, languageIdentifierValue) => new LanguageVariantElementsQuery(nConfig, nQueryService, (
                        mConfig, mQueryService, elements) => new UpsertLanguageVariantQuery(mConfig, mQueryService, contentItemIdentifier, contentItemIdentifierValue, languageIdentifier, languageIdentifierValue, elements)
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
            (config, queryService, identifier, identifierValue) => new DeleteContentTypeQuery(config, queryService, identifier, identifierValue)
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
            (config, queryService, identifier, identifierValue) => new ViewContentTypeQuery(config, queryService, identifier, identifierValue)
        );
    }

    listContentTypes(): ListContentTypesQuery {
        return new ListContentTypesQuery(
            this.config,
            this.queryService
        );
    }

    deleteTaxonomy(): FullIdentifierQuery<DeleteTaxonomyQuery> {
        return new FullIdentifierQuery<DeleteTaxonomyQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier, identifierValue) => new DeleteTaxonomyQuery(config, queryService, identifier, identifierValue)
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

    deleteAsset(): FullIdentifierQuery<DeleteAssetQuery> {
        return new FullIdentifierQuery<DeleteAssetQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier, identifierValue) => new DeleteAssetQuery(config, queryService, identifier, identifierValue)
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

    viewAsset(): IdIdentifierQuery<ViewAssetsQuery> {
        return new IdIdentifierQuery<ViewAssetsQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier, identifierValue) => new ViewAssetsQuery(config, queryService, identifier, identifierValue)
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

    viewContentItem(): FullIdentifierQuery<ViewContentItemQuery> {
        return new FullIdentifierQuery<ViewContentItemQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier, identifierValue) => new ViewContentItemQuery(config, queryService, identifier, identifierValue)
        );
    }

    addContentItem(): DataQuery<AddContentItemQuery, ContentItemContracts.IAddContentItemPostContract> {
        return new DataQuery<AddContentItemQuery, ContentItemContracts.IAddContentItemPostContract>(
            this.config,
            this.queryService,
            (config, queryService, data) => new AddContentItemQuery(config, queryService, data)
        );
    }

    updateContentItem(): FullIdentifierQuery<DataQuery<UpdateContentItemQuery, ContentItemContracts.IUpdateContentItemPostContract>> {
        return new FullIdentifierQuery<DataQuery<UpdateContentItemQuery, ContentItemContracts.IUpdateContentItemPostContract>>(
            this.config, this.queryService, (
                config, queryService, identifier, identifierValue) => new DataQuery<UpdateContentItemQuery, ContentItemContracts.IUpdateContentItemPostContract>(
                    config, queryService, (nConfig, nQueryService, data) => new UpdateContentItemQuery(nConfig, nQueryService, data, identifier, identifierValue)
                )
        );
    }

    deleteContentItem(): FullIdentifierQuery<DeleteContentItemQuery> {
        return new FullIdentifierQuery<DeleteContentItemQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier, identifierValue) => new DeleteContentItemQuery(config, queryService, identifier, identifierValue)
        );
    }

    listLanguageVariants(): FullIdentifierQuery<ListLanguageVariantsQuery> {
        return new FullIdentifierQuery<ListLanguageVariantsQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier, identifierValue) => new ListLanguageVariantsQuery(config, queryService, identifier, identifierValue)
        );
    }
}
