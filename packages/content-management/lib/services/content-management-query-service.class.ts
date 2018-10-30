import { IHttpService, ISDKInfo } from 'kentico-cloud-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContentItemsResponse } from '..//responses';
import { IContentManagementClientConfig } from '../config/icontent-management-client-config.interface';
import { contentManagementResponseMapper } from '../mappers';
import { IContentManagementQueryConfig } from '../models';
import { BaseContentManagementQueryService } from './base-content-management-service.class';

export class ContentManagementQueryService extends BaseContentManagementQueryService {

    constructor(
        protected config: IContentManagementClientConfig,
        protected httpService: IHttpService,
        protected sdkInfo: ISDKInfo
    ) {
        super(config, httpService, sdkInfo);
    }

    listContentItems(
        url: string,
        config?: IContentManagementQueryConfig
    ): Observable<ContentItemsResponse> {
        return this.getResponse(
            url,
            config
        ).pipe(
            map(response => {
                return contentManagementResponseMapper.mapListingItemsResponse(response);
            })
        );
    }
}
