import { IBaseResponse } from 'kentico-cloud-core';

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

    private mapAsset(rawAsset: AssetContracts.IAssetModelContract): AssetModels.Asset {
        return new AssetModels.Asset({
            descriptions: rawAsset.descriptions.map(m => new AssetModels.AssetFileDescription({
                description: m.description,
                language: super.mapReference(m.language)
            })),
            externalId: rawAsset.external_id,
            fileName: rawAsset.file_name,
            fileReference: new AssetModels.AssetFileReference({
                id: rawAsset.file_reference.id,
                type: rawAsset.file_reference.type
            }),
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
