import { SharedContracts } from './shared-contracts';

export namespace AssetContracts {
    export interface IAssetModelContract {
        id: string;
        file_name: string;
        title: string;
        image_width: number;
        image_height: number;
        size: number;
        type: string;
        file_reference: IAssetFileReferenceContract;
        descriptions: IAssetFileDescriptionContract[];
        external_id: string;
        last_modified: string;
    }

    export interface IAssetFileReferenceContract  {
        id: string;
        type: string;
    }

    export interface IAssetFileDescriptionContract {
        language: SharedContracts.IReferenceObjectContract;
        description: string;
    }

    export interface IAssetsListingResponseContract {
        assets: IAssetModelContract[];
        pagination: SharedContracts.IPaginationModelContract;
    }

    // tslint:disable-next-line:no-empty-interface
    export interface IUploadBinaryFileResponseContract extends IAssetFileReferenceContract {
    }

}


