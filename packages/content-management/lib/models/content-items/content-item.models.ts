
export namespace ContentItemModels {

    export class ContentItem {

        public id!: string;
        public name!: string;
        public codename!: string;
        public type!: {
            id: string
        };
        public sitemapLocations!: [{
            id: string
        }];
        public externalId?: string;
        public lastModified!: Date;


        constructor(
            data: {
                id: string,
                name: string,
                codename: string,
                type: {
                    id: string
                },
                sitemapLocations: [{
                    id: string
                }],
                externalId?: string,
                lastModified: Date
            }
        ) {
            Object.assign(this, data);
        }
    }
}

