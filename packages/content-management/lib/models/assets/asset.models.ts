import { SharedModels } from '../shared/shared-models';

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

    export class AssetFileReference {

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
}
