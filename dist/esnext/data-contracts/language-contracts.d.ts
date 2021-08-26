import { IPaginationContract } from './shared/ipagination.interface';
export declare namespace LanguageContracts {
    interface IListLanguagesContract {
        languages: ILanguageContract[];
        pagination: IPaginationContract;
    }
    interface ILanguageContract {
        system: {
            id: string;
            name: string;
            codename: string;
        };
    }
}
