import { SharedModels } from '../shared/shared-models';
import { SharedContracts } from '../../contracts';

export namespace AssetModels {

    export class Asset {
        public id!: string;
        public fileName!: string;
        public title!: string | null;
        public imageWidth!: number | null;
        public imageHeight!: number | null;
        public size!: number;
        public type!: string;
        public fileReference!: AssetFileReference;
        public descriptions!: AssetFileDescription[];
        public externalId?: string;
        public lastModified!: Date;

        constructor(
            data: {
                id: string;
                fileName: string;
                title: string | null;
                imageWidth: number | null;
                imageHeight: number | null;
                size: number;
                type: string;
                fileReference: AssetFileReference;
                descriptions: AssetFileDescription[];
                externalId?: string;
                lastModified: Date;
            }
        ) {
            Object.assign(this, data);
        }
    }

    export interface IAssetFileReference {
        id: string;
        type: string;
    }

    export class AssetFileReference implements IAssetFileReference {

        public id!: string;
        public type!: string;

        constructor(
            data: {
                id: string;
                type: string;
            }
        ) {
            Object.assign(this, data);
        }
    }

    export interface IAssetFileDescription {
        language: SharedContracts.IReferenceObjectContract;
        description: string;
    }

    export class AssetFileDescription {
        public language!: SharedModels.ReferenceObject;
        public description!: string | null;

        constructor(
            data: {
                language: SharedModels.ReferenceObject,
                description: string | null
            }
        ) {
            Object.assign(this, data);
        }
    }

    export interface IUploadBinaryFileRequestData {
        binaryData: any;
        contentType: string;
        contentLength?: number;
        filename: string;
    }

    export interface IAddAssetRequestData {
        fileReference: IAssetFileReference;
        title?: string;
        externalId?: string;
        descriptions: IAssetFileDescription[];
    }

    export interface IUpdateAssetRequestData {
        assetId: string;
        title?: string;
        descriptions: IAssetFileDescription[];
    }

    export interface IUpsertAssetRequestData {
        assetExternalId: string;
        descriptions: IAssetFileDescription[];
        title?: string;
        fileReference?: IAssetFileReference;
    }
}
