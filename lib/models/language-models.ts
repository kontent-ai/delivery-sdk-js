import { IQueryConfig } from './common';

export interface ILanguageSystem {
    id: string;
    name: string;
    codename: string;
}

export interface ILanguage {
    system: ILanguageSystem;
}

export interface ILanguagesQueryConfig extends IQueryConfig {
    /**
     * No dedicated properties required at this moment
     */
}
