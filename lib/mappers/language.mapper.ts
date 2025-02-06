import { Contracts } from '../contracts';
import { ClientTypes, ILanguage } from '../models';

export class LanguageMapper<TClientTypes extends ClientTypes> {
    mapMultipleLanguages(response: Contracts.IListLanguagesContract): ILanguage<TClientTypes['languageCodenames']>[] {
        return response.languages.map((language) => {
            return this.mapLanguage(language);
        });
    }

    private mapLanguage(language: Contracts.ILanguageContract): ILanguage<TClientTypes['languageCodenames']> {
        if (!language) {
            throw Error(`Cannot map language`);
        }

        return {
            system: language.system
        };
    }
}
