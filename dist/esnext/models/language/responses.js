import { BaseKontentResponseStandardDebug } from '../common';
export var LanguageResponses;
(function (LanguageResponses) {
    class ListLanguagesResponse extends BaseKontentResponseStandardDebug {
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
})(LanguageResponses || (LanguageResponses = {}));
//# sourceMappingURL=responses.js.map