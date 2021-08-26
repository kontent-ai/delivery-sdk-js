import { IQueryConfig } from '../common';
export interface ILanguageSystem {
    id: string;
    name: string;
    codename: string;
}
export declare class Language {
    system: ILanguageSystem;
    constructor(data: {
        system: ILanguageSystem;
    });
}
export interface ILanguagesQueryConfig extends IQueryConfig {
}
