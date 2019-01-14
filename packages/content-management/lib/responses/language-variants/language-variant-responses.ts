import { LanguageVariantContracts } from '../../contracts';
import { LanguageVariantModels } from '../../models';
import { BaseResponses } from '../base-responses';

export namespace LanguageVariantResponses {

    export class ListLanguageVariantsResponse extends BaseResponses.BaseContentManagementResponse<LanguageVariantContracts.IListLanguageVariantsResponseContract[],
        {
            variants: LanguageVariantModels.ContentItemLanguageVariant[],
        }>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: LanguageVariantContracts.IListLanguageVariantsResponseContract[],
            data: {
                variants: LanguageVariantModels.ContentItemLanguageVariant[],
            }
        ) {
            super(debug, rawData, data);
        }
    }
}

