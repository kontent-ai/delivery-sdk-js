import { HttpService } from 'kentico-cloud-core';

import { IContentManagementClientConfig } from '../config';
import { ContentItemContracts } from '../contracts';
import {
    AddContentItemQuery,
    DeleteContentItemQueryInit,
    ListContentItemsQuery,
    UpdateContentItemQueryInit,
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

    addContentItem(item: ContentItemContracts.IAddContentItemPostContract): AddContentItemQuery {
        return new AddContentItemQuery(this.config, this.queryService, item);
    }

    updateContentItem(item: ContentItemContracts.IUpdateContentItemPostContract): UpdateContentItemQueryInit {
        return new UpdateContentItemQueryInit(
            this.config,
            this.queryService,
            item
        );
    }

    deleteContentItem(): DeleteContentItemQueryInit {
        return new DeleteContentItemQueryInit(
            this.config,
            this.queryService,
        );
    }
}
