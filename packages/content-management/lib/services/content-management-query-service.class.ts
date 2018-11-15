import { IHttpService, ISDKInfo } from 'kentico-cloud-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IContentManagementClientConfig } from '../config/icontent-management-client-config.interface';
import { ContentItemContracts } from '../contracts';
import { contentItemsResponseMapper } from '../mappers';
import { IContentManagementQueryConfig, ContentItemModels, ContentItemElements } from '../models';
import { ContentItemResponses } from '../responses';
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
    ): Observable<ContentItemResponses.ContentItemsResponse> {
        return this.getResponse<ContentItemContracts.IContentItemsListingResponseContract>(
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
    ): Observable<ContentItemResponses.ViewContentItemResponse> {
        return this.getResponse<ContentItemContracts.IViewContentItemResponseContract>(
            url,
            config
        ).pipe(
            map(response => {
                return contentItemsResponseMapper.mapViewContentItemResponse(response);
            })
        );
    }

    addContentItem(
        url: string,
        data: ContentItemContracts.IAddContentItemPostContract,
        config?: IContentManagementQueryConfig
    ): Observable<ContentItemResponses.AddContentItemResponse> {
        return this.postResponse<ContentItemContracts.IAddContentItemResponseContract>(
            url,
            data,
            config
        ).pipe(
            map(response => {
                return contentItemsResponseMapper.mapAddContentItemResponse(response);
            })
        );
    }

    updateContentItem(
        url: string,
        data: ContentItemContracts.IUpdateContentItemPostContract,
        config?: IContentManagementQueryConfig
    ): Observable<ContentItemResponses.AddContentItemResponse> {
        return this.putResponse<ContentItemContracts.IUpdateContentItemResponseContract>(
            url,
            data,
            config
        ).pipe(
            map(response => {
                return contentItemsResponseMapper.mapUpdateContentItemResponse(response);
            })
        );
    }

    deleteContentItem(
        url: string,
        config?: IContentManagementQueryConfig
    ): Observable<ContentItemResponses.DeleteContentItemResponse> {
        return this.deleteResponse<ContentItemContracts.IDeleteContentItemResponseContract>(
            url,
            config
        ).pipe(
            map(response => {
                return contentItemsResponseMapper.mapDeleteContentItemResponse(response);
            })
        );
    }

    listLanguageVariants<TElements extends ContentItemModels.IContentItemVariantElements>(
        url: string,
        fieldDefinitions: ContentItemElements.IContentItemElementDefinition[],
        createElements: () => TElements,
        config?: IContentManagementQueryConfig
    ): Observable<ContentItemResponses.ListLanguageVariantsResponse<TElements>> {
        return this.getResponse<ContentItemContracts.IListLanguageVariantsResponseContract[]>(
            url,
            config
        ).pipe(
            map(response => {
                return contentItemsResponseMapper.mapLanguageVariantsResponse<TElements>(response, fieldDefinitions, createElements);
            })
        );
    }
}
