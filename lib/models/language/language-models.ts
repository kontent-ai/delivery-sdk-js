import { IQueryConfig } from '../common';

export interface ILanguageSystem {
    id: string;
    name: string;
    codename: string;
}

export class Language {
    system: ILanguageSystem;


    constructor(
        data: {
            system: ILanguageSystem
        }
    ) {
        this.system = data.system;
    }
}

export interface ILanguagesQueryConfig extends IQueryConfig {
    /**
     * No dedicated properties required at this moment
     */
}
