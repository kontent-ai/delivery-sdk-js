import { IBaseResponse } from '@kentico/kontent-core';

import { AssetContracts } from '../contracts';
import { AssetModels } from '../models';
import { AssetResponses } from '../responses';
import { BaseMapper } from './base-mapper';

export class AssetsResponseMapper extends BaseMapper {

    mapListingAssetsResponse(
        response: IBaseResponse<AssetContracts.IAssetsListingResponseContract>
    ): AssetResponses.AssetsListResponse {

        const pagination = super.mapPagination(response.data.pagination);
        const items = response.data.assets.map(m => this.mapAsset(m));

        return new AssetResponses.AssetsListResponse(super.mapResponseDebug(response), response.data, {
            pagination: pagination,
            items: items
        });
    }

    mapViewAssetResponse(
        response: IBaseResponse<AssetContracts.IAssetModelContract>
    ): AssetResponses.ViewAssetResponse {

        return new AssetResponses.ViewAssetResponse(super.mapResponseDebug(response), response.data, this.mapAsset(response.data));
    }

    mapUploadBinaryFileResponse(
        response: IBaseResponse<AssetContracts.IUploadBinaryFileResponseContract>
    ): AssetResponses.UploadBinaryFileResponse {
        return new AssetResponses.UploadBinaryFileResponse(super.mapResponseDebug(response), response.data, this.mapAssetReference(response.data));
    }

    mapAddAssetResponse(
        response: IBaseResponse<AssetContracts.IAddAssetResponseContract>
    ): AssetResponses.AddAssetResponse {
        return new AssetResponses.AddAssetResponse(super.mapResponseDebug(response), response.data, this.mapAsset(response.data));
    }

    mapUpdateAssetResponse(
        response: IBaseResponse<AssetContracts.IUpdateAssetResponseContract>
    ): AssetResponses.UpdateAssetResponse {
        return new AssetResponses.UpdateAssetResponse(super.mapResponseDebug(response), response.data, this.mapAsset(response.data));
    }

    mapUpsertAssetResponse(
        response: IBaseResponse<AssetContracts.IUpsertAssetResponseContract>
    ): AssetResponses.UpsertAssertResponse {
        return new AssetResponses.UpsertAssertResponse(super.mapResponseDebug(response), response.data, this.mapAsset(response.data));
    }

    mapDeleteAssetResponse(
        response: IBaseResponse<AssetContracts.IDeleteAssetResponseContract>
    ): AssetResponses.DeleteAssetResponse {
        return new AssetResponses.DeleteAssetResponse(super.mapResponseDebug(response), response.data, undefined);
    }

    private mapAssetReference(
        rawFileReference: AssetContracts.IAssetFileReferenceContract
    ): AssetModels.AssetFileReference {
        return new AssetModels.AssetFileReference({
            id: rawFileReference.id,
            type: rawFileReference.type
        });
    }

    private mapAsset(rawAsset: AssetContracts.IAssetModelContract): AssetModels.Asset {
        return new AssetModels.Asset({
            descriptions: rawAsset.descriptions.map(m => new AssetModels.AssetFileDescription({
                description: m.description,
                language: super.mapReference(m.language)
            })),
            externalId: rawAsset.external_id,
            fileName: rawAsset.file_name,
            fileReference: this.mapAssetReference(rawAsset.file_reference),
            id: rawAsset.id,
            imageHeight: rawAsset.image_height,
            imageWidth: rawAsset.image_width,
            lastModified: new Date(rawAsset.last_modified),
            size: rawAsset.size,
            title: rawAsset.title,
            type: rawAsset.type
        });
    }
}

export const assetsResponseMapper = new AssetsResponseMapper();
