import { LanguageContracts } from '../data-contracts';
import { ILanguage } from '../models';

export class LanguageMapper {
    mapMultipleLanguages(response: LanguageContracts.IListLanguagesContract): ILanguage[] {
        return response.languages.map((language) => {
            return this.mapLanguage(language);
        });
    }

    private mapLanguage(language: LanguageContracts.ILanguageContract): ILanguage {
        if (!language) {
            throw Error(`Cannot map language`);
        }

        return {
            system: language.system
        };
    }
}
