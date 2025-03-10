import { Contracts } from '../contracts';
import { ILanguage } from '../models';

export class LanguageMapper<TLanguageCodenames extends string> {
    mapMultipleLanguages(response: Contracts.IListLanguagesContract): ILanguage<TLanguageCodenames>[] {
        return response.languages.map((language) => {
            return this.mapLanguage(language);
        });
    }

    private mapLanguage(language: Contracts.ILanguageContract): ILanguage<TLanguageCodenames> {
        if (!language) {
            throw Error(`Cannot map language`);
        }

        return {
            system: {
                codename: language.system.codename as TLanguageCodenames,
                id: language.system.id,
                name: language.system.name
            }
        };
    }
}
