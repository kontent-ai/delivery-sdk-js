import { ReferenceModel } from '../reference-model';

export namespace ContentItemModels {

    export class ContentItemModel {

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

    export class ContentItemVariantElements  {
        // indexer for properties
        [key: string]: any;
    }

    export class ContentItemLanguageVariant<TElements extends ContentItemVariantElements> {
        public rawElements!: any;
        public item!: ReferenceModel;
        public elements!: TElements;
        public language!: ReferenceModel;
        public lastModified!: Date;

        constructor(
            data: {
                rawElements: any;
                item: ReferenceModel;
                elements: TElements;
                language: ReferenceModel;
                lastModified: Date;
            }
        ) {
            Object.assign(this, data);
        }
    }
}

