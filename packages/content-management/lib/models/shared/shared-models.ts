export namespace SharedModels {

    export class Pagination {
        constructor(
            public continuationToken: string | null,
            public nextPage: string | null
        ) { }
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
