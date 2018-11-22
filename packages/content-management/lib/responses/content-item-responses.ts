import { ContentItemContracts } from '../contracts';
import { ContentItemModels, SharedModels } from '../models';
import { BaseResponses } from './base-responses';

export namespace ContentItemResponses {

    export class ContentItemsResponse extends BaseResponses.BaseContentManagementResponse<ContentItemContracts.IContentItemsListingResponseContract,
        {
            items: ContentItemModels.ContentItemModel[],
            pagination: SharedModels.PaginationModel
        }>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentItemContracts.IContentItemsListingResponseContract,
            data: {
                items: ContentItemModels.ContentItemModel[],
                pagination: SharedModels.PaginationModel
            }
        ) {
            super(debug, rawData, data);
        }
    }

    export class ViewContentItemResponse extends BaseResponses.BaseContentManagementResponse<ContentItemContracts.IViewContentItemResponseContract, ContentItemModels.ContentItemModel> {

        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentItemContracts.IViewContentItemResponseContract,
            data: ContentItemModels.ContentItemModel
        ) {
            super(debug, rawData, data);
        }
    }

    export class AddContentItemResponse extends BaseResponses.BaseContentManagementResponse<ContentItemContracts.IAddContentItemResponseContract, ContentItemModels.ContentItemModel> {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentItemContracts.IAddContentItemResponseContract,
            data: ContentItemModels.ContentItemModel
        ) {
            super(debug, rawData, data);
        }
    }

    export class UpdateContentItemResponse extends BaseResponses.BaseContentManagementResponse<ContentItemContracts.IUpdateContentItemResponseContract, ContentItemModels.ContentItemModel> {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentItemContracts.IAddContentItemResponseContract,
            data: ContentItemModels.ContentItemModel
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

    export class ListLanguageVariantsResponse<TElements extends ContentItemModels.ContentItemVariantElements> extends BaseResponses.BaseContentManagementResponse<ContentItemContracts.IListLanguageVariantsResponseContract[],
        {
            variants: ContentItemModels.ContentItemLanguageVariant<TElements>[],
        }>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: ContentItemContracts.IListLanguageVariantsResponseContract[],
            data: {
                variants: ContentItemModels.ContentItemLanguageVariant<TElements>[],
            }
        ) {
            super(debug, rawData, data);
        }
    }
}

