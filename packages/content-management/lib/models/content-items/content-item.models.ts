import { SharedModels } from '../shared/shared-models';

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

    export class ContentItemVariantElements {
        // indexer for properties
        [key: string]: any;
    }

    export class ContentItemLanguageVariant<TElements extends ContentItemVariantElements> {
        public rawElements!: any;
        public item!: SharedModels.ReferenceObject;
        public elements!: TElements;
        public language!: SharedModels.ReferenceObject;
        public lastModified!: Date;

        constructor(
            data: {
                rawElements: any;
                item: SharedModels.ReferenceObject;
                elements: TElements;
                language: SharedModels.ReferenceObject;
                lastModified: Date;
            }
        ) {
            Object.assign(this, data);
        }
    }
}

