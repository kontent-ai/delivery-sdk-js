import { IHeader, IHttpService, ISDKInfo } from '@kentico/kontent-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IManagementClientConfig } from '../config/imanagement-client-config.interface';
import {
    AssetContracts,
    ContentItemContracts,
    ContentTypeContracts,
    ContentTypeSnippetContracts,
    LanguageVariantContracts,
    ProjectContracts,
    TaxonomyContracts,
    WorkflowContracts,
    LanguageContracts,
} from '../contracts';
import {
    assetsResponseMapper,
    contentItemsResponseMapper,
    contentTypeMapper,
    contentTypeSnippetMapper,
    languageVariantResponseMapper,
    projectMapper,
    taxonomyResponseMapper,
    workflowResponseMapper,
    languageResponseMapper,
} from '../mappers';
import {
    AssetModels,
    ContentTypeModels,
    ContentTypeSnippetModels,
    IContentManagementQueryConfig,
    LanguageVariantModels,
    TaxonomyModels,
    WorkflowModels,
    LanguageModels,
} from '../models';
import {
    AssetResponses,
    BaseResponses,
    ContentItemResponses,
    ContentTypeResponses,
    ContentTypeSnippetResponses,
    LanguageVariantResponses,
    ProjectResponses,
    TaxonomyResponses as TaxonomyResponses,
    WorkflowResponses,
    LanguageResponses,
} from '../responses';
import { BaseContentManagementQueryService } from './base-content-management-service.class';

export class ContentManagementQueryService extends BaseContentManagementQueryService {

    constructor(
        protected config: IManagementClientConfig,
        protected httpService: IHttpService,
        protected sdkInfo: ISDKInfo
    ) {
        super(config, httpService, sdkInfo);
    }

    publishOrScheduleLanguageVariant(
        url: string,
        data: WorkflowModels.IPublishOrSchedulePublishData,
        config: IContentManagementQueryConfig
    ): Observable<BaseResponses.EmptyContentManagementResponse> {
        return this.putResponse<void>(
            url,
            data,
            {},
            config,
        ).pipe(
            map(response => {
                return workflowResponseMapper.mapEmptyResponse(response);
            })
        );
    }

    createNewVersionOfLanguageVariant(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<BaseResponses.EmptyContentManagementResponse> {
        return this.putResponse<void>(
            url,
            undefined,
            {},
            config,
        ).pipe(
            map(response => {
                return workflowResponseMapper.mapEmptyResponse(response);
            })
        );
    }

    unpublishLanguageVariant(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<BaseResponses.EmptyContentManagementResponse> {
        return this.putResponse<void>(
            url,
            undefined,
            {},
            config,
        ).pipe(
            map(response => {
                return workflowResponseMapper.mapEmptyResponse(response);
            })
        );
    }

    cancelScheduledPublishingOfLanguageVariant(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<BaseResponses.EmptyContentManagementResponse> {
        return this.putResponse<void>(
            url,
            undefined,
            {},
            config,
        ).pipe(
            map(response => {
                return workflowResponseMapper.mapEmptyResponse(response);
            })
        );
    }

    changeWorkflowStepOfLanguageVariant(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<BaseResponses.EmptyContentManagementResponse> {
        return this.putResponse<void>(
            url,
            undefined,
            {},
            config,
        ).pipe(
            map(response => {
                return workflowResponseMapper.mapEmptyResponse(response);
            })
        );
    }

    listWorkflowSteps(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<WorkflowResponses.ListWorkflowStepsResponse> {
        return this.getResponse<WorkflowContracts.IListWorkflowStepsResponseContract>(
            url,
            {},
            config
        ).pipe(
            map(response => {
                return workflowResponseMapper.mapListWorkflowStepsResponse(response);
            })
        );
    }

    addContentType(
        url: string,
        data: ContentTypeModels.IAddContentTypeData,
        config: IContentManagementQueryConfig
    ): Observable<ContentTypeResponses.AddContentTypeResponse> {
        return this.postResponse<ContentTypeContracts.IAddContentTypeResponseContract>(
            url,
            data,
            {},
            config
        ).pipe(
            map(response => {
                return contentTypeMapper.mapAddContentTypeResponse(response);
            })
        );
    }

    viewContentTypeSnippet(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<ContentTypeSnippetResponses.ViewContentTypeSnippetResponse> {
        return this.getResponse<ContentTypeSnippetContracts.IViewContentTypeSnippetResponseContract>(
            url,
            {},
            config
        ).pipe(
            map(response => {
                return contentTypeSnippetMapper.mapViewContentTypeSnippetResponse(response);
            })
        );
    }

    deleteContentTypeSnippet(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<ContentTypeSnippetResponses.DeleteContentTypeSnippetResponse> {
        return this.deleteResponse<ContentTypeSnippetContracts.IDeleteContentTypeSnippetResponseContract>(
            url,
            {},
            config
        ).pipe(
            map(response => {
                return contentTypeSnippetMapper.mapDeleteContentTypeSnippetRespose(response);
            })
        );
    }

    addContentTypeSnippet(
        url: string,
        data: ContentTypeSnippetModels.IAddContentTypeSnippetData,
        config: IContentManagementQueryConfig
    ): Observable<ContentTypeSnippetResponses.AddContentTypeSnippetResponse> {
        return this.postResponse<ContentTypeSnippetContracts.IAddContentTypeSnippetResponseContract>(
            url,
            data,
            {},
            config
        ).pipe(
            map(response => {
                return contentTypeSnippetMapper.mapAddContentTypeSnippetResponse(response);
            })
        );
    }

    listContentTypeSnippets(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<ContentTypeSnippetResponses.ContentTypeSnippetListResponse> {
        return this.getResponse<ContentTypeSnippetContracts.IContentTypeSnippetListResponseContract>(
            url,
            {},
            config
        ).pipe(
            map(response => {
                return contentTypeSnippetMapper.mapListingResponse(response);
            })
        );
    }

    validateProjectContent(
        url: string,
        data: {
            projectId: string
        },
        config: IContentManagementQueryConfig
    ): Observable<ProjectResponses.ValidateProjectContentResponse> {
        return this.postResponse<ProjectContracts.IProjectReportResponseContract>(
            url,
            data,
            {},
            config,
        ).pipe(
            map(response => {
                return projectMapper.mapValidateProjectContentResponse(response);
            })
        );
    }

    deleteContentType(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<ContentTypeResponses.DeleteContentTypeResponse> {
        return this.deleteResponse<ContentTypeContracts.IDeleteContentTypeResponseContract>(
            url,
            {},
            config
        ).pipe(
            map(response => {
                return contentTypeMapper.mapDeleteContentTypeResponse(response);
            })
        );
    }

    viewContentType(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<ContentTypeResponses.ViewContentTypeResponse> {
        return this.getResponse<ContentTypeContracts.IViewContentTypeResponseContract>(
            url,
            {},
            config
        ).pipe(
            map(response => {
                return contentTypeMapper.mapViewContentTypeResponse(response);
            })
        );
    }

    listContentTypes(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<ContentTypeResponses.ContentTypeListResponse> {
        return this.getResponse<ContentTypeContracts.IContentTypeListResponseContract>(
            url,
            {},
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
            {},
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
            {},
            config,
        ).pipe(
            map(response => {
                return taxonomyResponseMapper.mapDeleteTaxonomyResponse(response);
            })
        );
    }

    listTaxonomies(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<TaxonomyResponses.TaxonomyListResponse> {
        return this.getResponse<TaxonomyContracts.ITaxonomyContract[]>(
            url,
            {},
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
            {},
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
        return this.putResponse<AssetContracts.IUpsertAssetResponseContract>(
            url,
            {
                file_reference: data.fileReference,
                title: data.title,
                descriptions: data.descriptions
            },
            {},
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
        return this.putResponse<AssetContracts.IUpdateAssetResponseContract>(
            url,
            {
                title: data.title,
                descriptions: data.descriptions
            },
            {},
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
            {},
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

        const headers: IHeader[] = [
            { header: 'Content-type', value: data.contentType },
        ];

        if (data.contentLength) {
            headers.push(
                { header: 'Content-length', value: data.contentLength.toString() }
            );
        }

        return this.postResponse<AssetContracts.IUploadBinaryFileResponseContract>(
            url,
            data.binaryData,
            {},
            config,
            headers
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
            {},
            config
        ).pipe(
            map(response => {
                return assetsResponseMapper.mapViewAssetResponse(response);
            })
        );
    }

    listAssets(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<AssetResponses.AssetsListResponse> {
        return this.getResponse<AssetContracts.IAssetsListingResponseContract>(
            url,
            {},
            config
        ).pipe(
            map(response => {
                return assetsResponseMapper.mapListingAssetsResponse(response);
            })
        );
    }

    listContentItems(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<ContentItemResponses.ContentItemsResponse> {
        return this.getResponse<ContentItemContracts.IContentItemsListingResponseContract>(
            url,
            {},
            config
        ).pipe(
            map(response => {
                return contentItemsResponseMapper.mapListingItemsResponse(response);
            })
        );
    }

    viewContentItem(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<ContentItemResponses.ViewContentItemResponse> {
        return this.getResponse<ContentItemContracts.IViewContentItemResponseContract>(
            url,
            {},
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
            {},
            config
        ).pipe(
            map(response => {
                return contentItemsResponseMapper.mapAddContentItemResponse(response);
            })
        );
    }

    upsertContentItem(
        url: string,
        data: ContentItemContracts.IUpsertContentItemPostContract,
        config: IContentManagementQueryConfig
    ): Observable<ContentItemResponses.UpsertContentItemResponse> {
        return this.putResponse<ContentItemContracts.IUpsertContentItemResponseContract>(
            url,
            data,
            {},
            config
        ).pipe(
            map(response => {
                return contentItemsResponseMapper.mapUpsertContentItemResponse(response);
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
            {},
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
            {},
            config
        ).pipe(
            map(response => {
                return contentItemsResponseMapper.mapDeleteContentItemResponse(response);
            })
        );
    }

    upsertLanguageVariant(
        url: string,
        elements: LanguageVariantModels.ILanguageVariantElement[],
        config: IContentManagementQueryConfig
    ): Observable<LanguageVariantResponses.UpsertLanguageVariantResponse> {
        return this.putResponse<LanguageVariantContracts.IUpsertLanguageVariantResponseContract>(
            url,
            {
                elements: elements
            },
            {},
            config
        ).pipe(
            map(response => {
                return languageVariantResponseMapper.mapUpsertLanguageVariantResponse(response);
            })
        );
    }

    viewLanguageVariant(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<LanguageVariantResponses.ViewLanguageVariantResponse> {
        return this.getResponse<LanguageVariantContracts.IViewLanguageVariantResponseContract>(
            url,
            {},
            config
        ).pipe(
            map(response => {
                return languageVariantResponseMapper.mapViewLanguageVariantResponse(response);
            })
        );
    }

    listLanguageVariantsOfItem(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<LanguageVariantResponses.ListLanguageVariantsOfItemResponse> {
        return this.getResponse<LanguageVariantContracts.IListLanguageVariantsOfItemResponseContract[]>(
            url,
            {},
            config
        ).pipe(
            map(response => {
                return languageVariantResponseMapper.mapLanguageVariantsOfItemResponse(response);
            })
        );
    }

    listLanguageVariantsOfContentType(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<LanguageVariantResponses.ListLanguageVariantsOfContentTypeResponse> {
        return this.getResponse<LanguageVariantContracts.IListLanguageVariantsOfContentTypeResponseContract>(
            url,
            {},
            config
        ).pipe(
            map(response => {
                return languageVariantResponseMapper.mapLanguageVariantsOfContentTypeResponse(response);
            })
        );
    }

    listLanguages(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<LanguageResponses.ListLanguagesResponse> {
        return this.getResponse<LanguageContracts.IListLanguagesResponseContract>(
            url,
            {},
            config
        ).pipe(
            map(response => {
                return languageResponseMapper.mapListLanguagesResponse(response);
            })
        );
    }

    viewLanguage(
        url: string,
        config: IContentManagementQueryConfig
    ): Observable<LanguageResponses.ViewLanguageResponse> {
        return this.getResponse<LanguageContracts.IViewLanguageResponseContract>(
            url,
            {},
            config
        ).pipe(
            map(response => {
                return languageResponseMapper.mapViewLanguageResponse(response);
            })
        );
    }

    addLanguage(
        url: string,
        config: IContentManagementQueryConfig,
        data: LanguageModels.IAddLanguageData
    ): Observable<LanguageResponses.AddLanguageResponse> {
        return this.postResponse<LanguageContracts.IAddLanguageResponseContract>(
            url,
            data,
            {},
            config,
        ).pipe(
            map(response => {
                return languageResponseMapper.mapAddLanguageResponse(response);
            })
        );
    }

    modifyLanguage(
        url: string,
        config: IContentManagementQueryConfig,
        data: LanguageModels.IModifyLanguageData[]
    ): Observable<LanguageResponses.ModifyLanguageResponse> {
        return this.postResponse<LanguageContracts.IModifyLanguageResponseContract>(
            url,
            data,
            {},
            config,
        ).pipe(
            map(response => {
                return languageResponseMapper.mapModifyLanguageResponse(response);
            })
        );
    }
}
