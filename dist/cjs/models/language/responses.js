"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageResponses = void 0;
const common_1 = require("../common");
var LanguageResponses;
(function (LanguageResponses) {
    class ListLanguagesResponse extends common_1.BaseKontentResponseStandardDebug {
        constructor(
        /**
         * List of languages
         */
        languages, 
        /**
         * Pagination
         */
        pagination, 
        /**
         * Response
         */
        response, isDeveloperMode) {
            super(response, isDeveloperMode);
            this.languages = languages;
            this.pagination = pagination;
        }
    }
    LanguageResponses.ListLanguagesResponse = ListLanguagesResponse;
})(LanguageResponses = exports.LanguageResponses || (exports.LanguageResponses = {}));
//# sourceMappingURL=responses.js.map