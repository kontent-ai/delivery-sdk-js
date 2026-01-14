import { IQueryConfig } from './common';

export interface ILanguageSystem<TLanguageCodenames extends string> {
    id: string;
    name: string;
    codename: TLanguageCodenames;
}

export interface ILanguage<TLanguageCodenames extends string> {
    system: ILanguageSystem<TLanguageCodenames>;
}

export interface ILanguagesQueryConfig extends IQueryConfig {
    /**
     * No dedicated properties required at this moment
     */
}
