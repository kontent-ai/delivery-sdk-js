import { ContentItemContracts } from '../contracts';
import { ReferenceModel } from '../models';
import { BaseResponses } from './base-responses';
import { SharedResponses } from './shared-responses';

export namespace ContentItemResponses {

    export class ContentItemModel {
        public id: string;
        public name: string;
        public codename: string;
        public type: {
            id: string
        };
        public sitemapLocations: [{
            id: string
        }];
        public externalId?: string;
        public lastModified: Date;

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

    export class ContentItemLanguageVariant {
        public item: ReferenceModel;
        public elements: any;
        public language: ReferenceModel;
        public lastModified: Date;

        constructor(
            data: {
                item: ReferenceModel;
                elements: any;
                language: ReferenceModel;
                lastModified: Date;
            }
        ) {
            Object.assign(this, data);
        }
    }

    export class ContentItemsResponse extends BaseResponses.BaseContentManagementResponse<ContentItemContracts.IContentItemsListingResponseContract,
        {
            items: ContentItemModel[],
            pagination: SharedResponses.PaginationModel
        }>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentItemContracts.IContentItemsListingResponseContract,
            data: {
                items: ContentItemModel[],
                pagination: SharedResponses.PaginationModel
            }
        ) {
            super(debug, rawData, data);
        }
    }

    export class ViewContentItemResponse extends BaseResponses.BaseContentManagementResponse<ContentItemContracts.IViewContentItemResponseContract, ContentItemModel> {

        data: ContentItemModel;

        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentItemContracts.IViewContentItemResponseContract,
            data: ContentItemModel
        ) {
            super(debug, rawData, data);
        }
    }

    export class AddContentItemResponse extends BaseResponses.BaseContentManagementResponse<ContentItemContracts.IAddContentItemResponseContract, ContentItemModel> {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentItemContracts.IAddContentItemResponseContract,
            data: ContentItemModel
        ) {
            super(debug, rawData, data);
        }
    }

    export class UpdateContentItemResponse extends BaseResponses.BaseContentManagementResponse<ContentItemContracts.IUpdateContentItemResponseContract, ContentItemModel> {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentItemContracts.IAddContentItemResponseContract,
            data: ContentItemModel
        ) {
            super(debug, rawData, data);
        }
    }

    export class DeleteContentItemResponse extends BaseResponses.BaseContentManagementResponse<ContentItemContracts.IDeleteContentItemResponseContract, undefined> {

        data: undefined;

        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentItemContracts.IDeleteContentItemResponseContract,
        ) {
            super(debug, rawData, undefined);
        }
    }

    export class ListLanguageVariantsResponse extends BaseResponses.BaseContentManagementResponse<ContentItemContracts.IListLanguageVariantsResponseContract[],
        {
            variants: ContentItemLanguageVariant[],
        }>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentItemContracts.IListLanguageVariantsResponseContract[],
            data: {
                variants: ContentItemLanguageVariant[],
            }
        ) {
            super(debug, rawData, data);
        }
    }
}

