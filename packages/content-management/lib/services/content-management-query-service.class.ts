import { IHttpService, ISDKInfo } from 'kentico-cloud-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IContentManagementClientConfig } from '../config/icontent-management-client-config.interface';
import { AssetContracts, ContentItemContracts, ContentTypeContracts, TaxonomyContracts } from '../contracts';
import { assetsResponseMapper, contentItemsResponseMapper, contentTypeMapper, taxonomyResponseMapper } from '../mappers';
import {
    AssetModels,
    ContentItemElements,
    ContentItemModels,
    IContentManagementQueryConfig,
    TaxonomyModels,
} from '../models';
import {
    AssetResponses,
    ContentItemResponses,
    ContentTypeResponses,
    TaxonomyResponses as TaxonomyResponses,
} from '../responses';
import { BaseContentManagementQueryService } from './base-content-management-service.class';

export class ContentManagementQueryService extends BaseContentManagementQueryService {

    constructor(
        protected config: IContentManagementClientConfig,
        protected httpService: IHttpService,
        protected sdkInfo: ISDKInfo
    ) {
        super(config, httpService, sdkInfo);
    }

    viewContentType(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<ContentTypeResponses.ViewContentTypeResponse> {
        return this.getResponse<ContentTypeContracts.IViewContentTypeResponse>(
            url,
            config
        ).pipe(
            map(response => {
                return contentTypeMapper.mapViewContentTypeResponse(response);
            })
        );
    }

    listContentTypes(
        url: string,
        config?: IContentManagementQueryConfig
    ): Observable<ContentTypeResponses.ContentTypeListResponse> {
        return this.getResponse<ContentTypeContracts.IContentTypeListResponse>(
            url,
            config
        ).pipe(
            map(response => {
                return contentTypeMapper.mapListingResponse(response);
            })
        );
    }

    addTaxonomy(
        url: string,
        data: TaxonomyModels.IAddTaxonomyRequestModel,
        config: IContentManagementQueryConfig
    ): Observable<TaxonomyResponses.AddTaxonomyResponse> {
        return this.postResponse<TaxonomyContracts.IAddTaxonomyResponseContract>(
            url,
            {
                name: data.name,
                external_id: data.externalId,
                terms: data.terms
            },
            config,
        ).pipe(
            map(response => {
                return taxonomyResponseMapper.mapAddTaxonomyResponse(response);
            })
        );
    }

    deleteTaxonomy(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<TaxonomyResponses.DeleteTaxonomyResponse> {
        return this.deleteResponse<TaxonomyContracts.IDeleteTaxonomyResponseContract>(
            url,
            config,
        ).pipe(
            map(response => {
                return taxonomyResponseMapper.mapDeleteTaxonomyResponse(response);
            })
        );
    }

    listTaxonomies(
        url: string,
        config?: IContentManagementQueryConfig
    ): Observable<TaxonomyResponses.TaxonomyListResponse> {
        return this.getResponse<TaxonomyContracts.ITaxonomyContract[]>(
            url,
            config
        ).pipe(
            map(response => {
                return taxonomyResponseMapper.mapListingTaxonomysResponse(response);
            })
        );
    }

    deleteAsset(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<AssetResponses.DeleteAssetResponse> {
        return this.deleteResponse<AssetContracts.IDeleteAssetResponseContract>(
            url,
            config,
        ).pipe(
            map(response => {
                return assetsResponseMapper.mapDeleteAssetResponse(response);
            })
        );
    }

    upsertAsset(
        url: string,
        data: AssetModels.IUpsertAssetRequestData,
        config: IContentManagementQueryConfig
    ): Observable<AssetResponses.UpdateAssetResponse> {
        return this.postResponse<AssetContracts.IUpsertAssetResponseContract>(
            url,
            {
                file_reference: data.fileReference,
                title: data.title,
                descriptions: data.descriptions
            },
            config,
        ).pipe(
            map(response => {
                return assetsResponseMapper.mapUpsertAssetResponse(response);
            })
        );
    }

    updateAsset(
        url: string,
        data: AssetModels.IUpdateAssetRequestData,
        config: IContentManagementQueryConfig
    ): Observable<AssetResponses.UpdateAssetResponse> {
        return this.postResponse<AssetContracts.IUpdateAssetResponseContract>(
            url,
            {
                title: data.title,
                descriptions: data.descriptions
            },
            config,
        ).pipe(
            map(response => {
                return assetsResponseMapper.mapUpdateAssetResponse(response);
            })
        );
    }

    addAsset(
        url: string,
        data: AssetModels.IAddAssetRequestData,
        config: IContentManagementQueryConfig
    ): Observable<AssetResponses.AddAssetResponse> {
        return this.postResponse<AssetContracts.IAddAssetResponseContract>(
            url,
            {
                file_reference: data.fileReference,
                title: data.title,
                external_id: data.externalId,
                descriptions: data.descriptions
            },
            config,
        ).pipe(
            map(response => {
                return assetsResponseMapper.mapAddAssetResponse(response);
            })
        );
    }

    uploadBinaryFile(
        url: string,
        data: AssetModels.IUploadBinaryFileRequestData,
        config: IContentManagementQueryConfig
    ): Observable<AssetResponses.UploadBinaryFileResponse> {
        return this.postResponse<AssetContracts.IUploadBinaryFileResponseContract>(
            url,
            data.binaryData,
            config,
            [
                { header: 'Content-type', value: data.contentType },
                { header: 'Content-length', value: data.contentLength.toString() }
            ]
        ).pipe(
            map(response => {
                return assetsResponseMapper.mapUploadBinaryFileResponse(response);
            })
        );
    }

    viewAsset(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<AssetResponses.ViewAssetResponse> {
        return this.getResponse<AssetContracts.IAssetModelContract>(
            url,
            config
        ).pipe(
            map(response => {
                return assetsResponseMapper.mapViewAssetResponse(response);
            })
        );
    }

    listAssets(
        url: string,
        config?: IContentManagementQueryConfig
    ): Observable<AssetResponses.AssetsListResponse> {
        return this.getResponse<AssetContracts.IAssetsListingResponseContract>(
            url,
            config
        ).pipe(
            map(response => {
                return assetsResponseMapper.mapListingAssetsResponse(response);
            })
        );
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
        config: IContentManagementQueryConfig
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
        config: IContentManagementQueryConfig
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
        config: IContentManagementQueryConfig
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

    listLanguageVariants<TElements extends ContentItemModels.ContentItemVariantElements>(
        url: string,
        fieldDefinitions: ContentItemElements.IContentItemElementDefinition[],
        createElements: () => TElements,
        config: IContentManagementQueryConfig
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
