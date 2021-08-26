import { Language } from '../models';
export class LanguageMapper {
    mapMultipleLanguages(response) {
        return response.languages.map((language) => {
            return this.mapLanguage(language);
        });
    }
    mapLanguage(language) {
        if (!language) {
            throw Error(`Cannot map language`);
        }
        return new Language({
            system: language.system
        });
    }
}
//# sourceMappingURL=language.mapper.js.map