import { LanguageVariantContracts } from '../../contracts';
import { LanguageVariantModels } from '../../models';
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

