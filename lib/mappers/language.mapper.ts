import { LanguageContracts } from '../data-contracts';
import { Language } from '../models';

export class LanguageMapper {
    mapMultipleLanguages(response: LanguageContracts.IListLanguagesContract): Language[] {
        return response.languages.map((language) => {
            return this.mapLanguage(language);
        });
    }

    private mapLanguage(language: LanguageContracts.ILanguageContract): Language {
        if (!language) {
            throw Error(`Cannot map language`);
        }

        return new Language({
            system: language.system
        });
    }
}
