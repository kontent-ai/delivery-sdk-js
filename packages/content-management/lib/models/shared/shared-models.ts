import { CloudError } from 'kentico-cloud-core';

export namespace SharedModels {

    export class Pagination {
        constructor(
            public continuationToken: string | null,
            public nextPage: string | null
        ) { }
    }

    export class ValidationError {
        public message!: string;

        constructor(
            data: {
                message: string
            }
        ) {
            Object.assign(this, data);
        }
    }

    export class ContentManagementCloudError extends CloudError {

        public validationErrors!: ValidationError[];

        constructor(data:
            {
                message: string;
                requestId: string;
                errorCode: number;
                specificCode: number;
                originalError: any;
                validationErrors: ValidationError[]
            }
        ) {
            super(data);
        }

    }

    export class ReferenceObject {
        public id?: string;
        public codename?: string;
        public externalId?: string;

        constructor(
            data: {
                id?: string;
                codename?: string;
                externalId?: string;
            }
        ) {
            Object.assign(this, data);
        }
    }
}
