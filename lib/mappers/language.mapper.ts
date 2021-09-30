import { Contracts } from '../contracts';
import { ILanguage } from '../models';

export class LanguageMapper {
    mapMultipleLanguages(response: Contracts.IListLanguagesContract): ILanguage[] {
        return response.languages.map((language) => {
            return this.mapLanguage(language);
        });
    }

    private mapLanguage(language: Contracts.ILanguageContract): ILanguage {
        if (!language) {
            throw Error(`Cannot map language`);
        }

        return {
            system: language.system
        };
    }
}
