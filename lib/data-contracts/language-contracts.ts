import { IPaginationContract } from './shared/ipagination.interface';

export namespace LanguageContracts {
    export interface IListLanguagesContract {
        languages: ILanguageContract[];
        pagination: IPaginationContract;
    }

    export interface ILanguageContract {
        system: {
            id: string;
            name: string;
            codename: string;
        };
    }
}
