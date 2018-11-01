import { IHttpService, ISDKInfo } from 'kentico-cloud-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IContentManagementClientConfig } from '../config/icontent-management-client-config.interface';
import { IContentItemsListingResponseContract, IViewContentItemResponseContract } from '../contracts';
import { contentItemsResponseMapper } from '../mappers';
import { IContentManagementQueryConfig } from '../models';
import { ContentItemsResponse, ViewContentItemResponse } from '../responses';
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
        return this.getResponse<IContentItemsListingResponseContract>(
            url,
            config
        ).pipe(
            map(response => {
                return contentItemsResponseMapper.mapListingItemsResponse(response);
            })
        );
    }

    viewContentItem(
        url: string,
        config?: IContentManagementQueryConfig
    ): Observable<ViewContentItemResponse> {
        return this.getResponse<IViewContentItemResponseContract>(
            url,
            config
        ).pipe(
            map(response => {
                return contentItemsResponseMapper.mapViewContentItemResponse(response);
            })
        );
    }
}
