import { HttpService } from 'kentico-cloud-core';

import { IContentManagementClientConfig } from '../config';
import { ContentItemContracts } from '../contracts';
import { AssetModels, ContentItemModels, TaxonomyModels } from '../models';
import {
    AddAssetQuery,
    AddContentItemQuery,
    AddTaxonomyQuery,
    DataQuery,
    DeleteAssetQuery,
    DeleteContentItemQuery,
    DeleteTaxonomyQuery,
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

    listLanguageVariants<TElements extends ContentItemModels.ContentItemVariantElements>(): FullIdentifierQuery<ListLanguageVariantsQuery<TElements>> {
        return new FullIdentifierQuery<ListLanguageVariantsQuery<TElements>>(
            this.config,
            this.queryService,
            (config, queryService, identifier, identifierValue) => new ListLanguageVariantsQuery<TElements>(config, queryService, identifier, identifierValue)
        );
    }
}
