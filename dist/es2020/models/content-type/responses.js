import { BaseKontentResponseStandardDebug } from '../common';
export var TypeResponses;
(function (TypeResponses) {
    class ListContentTypesResponse extends BaseKontentResponseStandardDebug {
        /**
         * Response containing multiple types
         * @constructor
         * @param {IContentType[]} types - Content types
         * @param {Pagination} pagination - Pagination object
         */
        constructor(types, pagination, response, isDeveloperMode) {
            super(response, isDeveloperMode);
            this.types = types;
            this.pagination = pagination;
        }
    }
    TypeResponses.ListContentTypesResponse = ListContentTypesResponse;
    class ViewContentTypeResponse extends BaseKontentResponseStandardDebug {
        /**
         * Response containing single type
         * @constructor
         * @param {IContentType} type - Content type
         */
        constructor(type, response, isDeveloperMode) {
            super(response, isDeveloperMode);
            this.type = type;
        }
    }
    TypeResponses.ViewContentTypeResponse = ViewContentTypeResponse;
})(TypeResponses || (TypeResponses = {}));
//# sourceMappingURL=responses.js.map