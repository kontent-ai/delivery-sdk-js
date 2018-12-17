import { HttpService } from 'kentico-cloud-core';

import { IContentManagementClientConfig } from '../config';
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

    deleteAsset(): FullIdentifierQuery<DeleteAssetQuery> {
        return new FullIdentifierQuery<DeleteAssetQuery>(
            this.config,
            this.queryService,
            (config, queryService, identifier, identifierValue) => new DeleteAssetQuery(config, queryService, identifier, identifierValue)
        );
    }

    upsertAsset(data: AssetModels.IUpsertAssetRequestData): UpsertAssetQuery {
        return new UpsertAssetQuery(
            this.config,
            this.queryService,
            data
        );
    }

    updateAsset(data: AssetModels.IUpdateAssetRequestData): UpdateAssetQuery {
        return new UpdateAssetQuery(
            this.config,
            this.queryService,
            data
        );
    }

    addAsset(data: AssetModels.IAddAssetRequestData): AddAssetQuery {
        return new AddAssetQuery(
            this.config,
            this.queryService,
            data
        );
    }

    uploadBinaryFile(data: AssetModels.IUploadBinaryFileRequestData): UploadBinaryFileQuery {
        return new UploadBinaryFileQuery(
            this.config,
            this.queryService,
            data
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

    addContentItem(): AddContentItemQueryInit {
        return new AddContentItemQueryInit(this.config, this.queryService);
    }

    updateContentItem(): UpdateContentItemQueryInit {
        return new UpdateContentItemQueryInit(
            this.config,
            this.queryService
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
