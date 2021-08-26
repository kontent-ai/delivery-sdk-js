"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageMapper = void 0;
const models_1 = require("../models");
class LanguageMapper {
    mapMultipleLanguages(response) {
        return response.languages.map((language) => {
            return this.mapLanguage(language);
        });
    }
    mapLanguage(language) {
        if (!language) {
            throw Error(`Cannot map language`);
        }
        return new models_1.Language({
            system: language.system
        });
    }
}
exports.LanguageMapper = LanguageMapper;
//# sourceMappingURL=language.mapper.js.map