import { HttpService } from 'kentico-cloud-core';

import { IContentManagementClientConfig } from '../config';
import { AssetModels, ContentItemModels } from '../models';
import {
    AddContentItemQueryInit,
    DeleteContentItemQueryInit,
    ListAssetsQuery,
    ListContentItemsQuery,
    ListLanguageVariantsQueryInit,
    UpdateContentItemQueryInit,
    UploadBinaryFileQuery,
    ViewAssetsQueryInit,
    ViewContentItemQueryInit,
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

    uploadBinaryFile(data: AssetModels.IUploadBinaryFileRequestData): UploadBinaryFileQuery {
        return new UploadBinaryFileQuery(
            this.config,
            this.queryService,
            data
        );
    }

    viewAsset(): ViewAssetsQueryInit {
        return new ViewAssetsQueryInit(
            this.config,
            this.queryService
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

    viewContentItem(): ViewContentItemQueryInit {
        return new ViewContentItemQueryInit(
            this.config,
            this.queryService
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

    deleteContentItem(): DeleteContentItemQueryInit {
        return new DeleteContentItemQueryInit(
            this.config,
            this.queryService,
        );
    }

    listLanguageVariants<TElements extends ContentItemModels.ContentItemVariantElements = ContentItemModels.ContentItemVariantElements>(): ListLanguageVariantsQueryInit<TElements> {
        return new ListLanguageVariantsQueryInit<TElements>(
            this.config,
            this.queryService,
        );
    }
}
