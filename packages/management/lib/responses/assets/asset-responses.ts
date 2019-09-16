import { AssetContracts } from '../../contracts';
import { AssetModels, SharedModels } from '../../models';
import { BaseResponses } from '../base-responses';

export namespace AssetResponses {

    export class AssetsListResponse extends BaseResponses.BaseContentManagementResponse<AssetContracts.IAssetsListingResponseContract,
        {
            items: AssetModels.Asset[],
            pagination: SharedModels.Pagination
        }>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: AssetContracts.IAssetsListingResponseContract,
            data: {
                items: AssetModels.Asset[],
                pagination: SharedModels.Pagination
            }
        ) {
            super(debug, rawData, data);
        }
    }

    export class ViewAssetResponse extends BaseResponses.BaseContentManagementResponse<AssetContracts.IAssetModelContract, AssetModels.Asset>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: AssetContracts.IAssetModelContract,
            data: AssetModels.Asset
        ) {
            super(debug, rawData, data);
        }
    }

    export class UploadBinaryFileResponse extends BaseResponses.BaseContentManagementResponse<AssetContracts.IUploadBinaryFileResponseContract, AssetModels.AssetFileReference>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: AssetContracts.IUploadBinaryFileResponseContract,
            data: AssetModels.AssetFileReference
        ) {
            super(debug, rawData, data);
        }
    }

    export class AddAssetResponse extends BaseResponses.BaseContentManagementResponse<AssetContracts.IAddAssetResponseContract, AssetModels.Asset>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: AssetContracts.IAddAssetResponseContract,
            data: AssetModels.Asset
        ) {
            super(debug, rawData, data);
        }
    }

    export class UpdateAssetResponse extends BaseResponses.BaseContentManagementResponse<AssetContracts.IUpdateAssetResponseContract, AssetModels.Asset>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: AssetContracts.IUpdateAssetResponseContract,
            data: AssetModels.Asset
        ) {
            super(debug, rawData, data);
        }
    }

    export class UpsertAssertResponse extends BaseResponses.BaseContentManagementResponse<AssetContracts.IUpsertAssetResponseContract, AssetModels.Asset>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: AssetContracts.IUpsertAssetResponseContract,
            data: AssetModels.Asset
        ) {
            super(debug, rawData, data);
        }
    }

    export class DeleteAssetResponse extends BaseResponses.BaseContentManagementResponse<AssetContracts.IDeleteAssetResponseContract, void>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: AssetContracts.IDeleteAssetResponseContract,
            data: void
        ) {
            super(debug, rawData, data);
        }
    }
}

