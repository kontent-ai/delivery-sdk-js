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
}

