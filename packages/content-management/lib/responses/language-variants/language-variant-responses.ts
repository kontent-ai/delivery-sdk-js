import { LanguageVariantContracts } from '../../contracts';
import { LanguageVariantModels, SharedModels } from '../../models';
import { BaseResponses } from '../base-responses';

export namespace LanguageVariantResponses {

    export class ListLanguageVariantsOfItemResponse extends BaseResponses.BaseContentManagementResponse<LanguageVariantContracts.IListLanguageVariantsOfItemResponseContract[],
        {
            variants: LanguageVariantModels.ContentItemLanguageVariant[],
        }>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: LanguageVariantContracts.IListLanguageVariantsOfItemResponseContract[],
            data: {
                variants: LanguageVariantModels.ContentItemLanguageVariant[],
            }
        ) {
            super(debug, rawData, data);
        }
    }

    export class ListLanguageVariantsOfContentTypeResponse extends BaseResponses.BaseContentManagementResponse<LanguageVariantContracts.IListLanguageVariantsOfContentTypeResponseContract,
        {
            variants: LanguageVariantModels.ContentItemLanguageVariant[],
            pagination: SharedModels.Pagination
        }>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: LanguageVariantContracts.IListLanguageVariantsOfContentTypeResponseContract,
            data: {
                variants: LanguageVariantModels.ContentItemLanguageVariant[],
                pagination: SharedModels.Pagination
            }
        ) {
            super(debug, rawData, data);
        }
    }

    export class UpsertLanguageVariantResponse extends BaseResponses.BaseContentManagementResponse<LanguageVariantContracts.IUpsertLanguageVariantResponseContract, LanguageVariantModels.ContentItemLanguageVariant> {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: LanguageVariantContracts.IUpsertLanguageVariantResponseContract,
            data: LanguageVariantModels.ContentItemLanguageVariant,
        ) {
            super(debug, rawData, data);
        }
    }

    export class ViewLanguageVariantResponse extends BaseResponses.BaseContentManagementResponse<LanguageVariantContracts.IViewLanguageVariantResponseContract, LanguageVariantModels.ContentItemLanguageVariant> {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: LanguageVariantContracts.IViewLanguageVariantResponseContract,
            data: LanguageVariantModels.ContentItemLanguageVariant,
        ) {
            super(debug, rawData, data);
        }
    }
}

