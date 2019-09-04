import { SharedContracts } from './shared-contracts';

export namespace LanguageContracts {

    export interface ILanguageModelContract {
        name: string;
        id: string;
        codename: string;
        external_id?: string;
        is_active: boolean;
        is_default: boolean;
        fallback_language?: IFallbackLanguageContract;
    }

    export interface IFallbackLanguageContract {
        id: string;
    }

    export interface IListLanguagesResponseContract {
        languages: ILanguageModelContract[];
        pagination: SharedContracts.IPaginationModelContract;
    }

    export interface IViewLanguageResponseContract extends ILanguageModelContract {
    }

    export interface IAddLanguageResponseContract extends ILanguageModelContract {
    }

    export interface IModifyLanguageResponseContract extends ILanguageModelContract {
    }
}
