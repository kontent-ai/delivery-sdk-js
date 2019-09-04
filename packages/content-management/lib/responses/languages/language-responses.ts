import { LanguageContracts } from '../../contracts/language-contracts';
import { LanguageModels, SharedModels } from '../../models';
import { BaseResponses } from '../base-responses';

export namespace LanguageResponses {

    export class ListLanguagesResponse extends BaseResponses.BaseContentManagementResponse<LanguageContracts.IListLanguagesResponseContract, {
        languages: LanguageModels.LanguageModel[],
        pagination: SharedModels.Pagination
    }>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: LanguageContracts.IListLanguagesResponseContract,
            data: {
                languages: LanguageModels.LanguageModel[],
                pagination: SharedModels.Pagination
            }
        ) {
            super(debug, rawData, data);
        }
    }

    export class ViewLanguageResponse extends BaseResponses.BaseContentManagementResponse<LanguageContracts.IViewLanguageResponseContract, LanguageModels.LanguageModel>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: LanguageContracts.IViewLanguageResponseContract,
            data: LanguageModels.LanguageModel
        ) {
            super(debug, rawData, data);
        }
    }

    export class AddLanguageResponse extends BaseResponses.BaseContentManagementResponse<LanguageContracts.IAddLanguageResponseContract, LanguageModels.LanguageModel>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: LanguageContracts.IAddLanguageResponseContract,
            data: LanguageModels.LanguageModel
        ) {
            super(debug, rawData, data);
        }
    }

    export class ModifyLanguageResponse extends BaseResponses.BaseContentManagementResponse<LanguageContracts.IModifyLanguageResponseContract, LanguageModels.LanguageModel>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: LanguageContracts.IModifyLanguageResponseContract,
            data: LanguageModels.LanguageModel
        ) {
            super(debug, rawData, data);
        }
    }

}
