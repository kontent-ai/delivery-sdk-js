"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeResponses = void 0;
const common_1 = require("../common");
var TypeResponses;
(function (TypeResponses) {
    class ListContentTypesResponse extends common_1.BaseKontentResponseStandardDebug {
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
    class ViewContentTypeResponse extends common_1.BaseKontentResponseStandardDebug {
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
})(TypeResponses = exports.TypeResponses || (exports.TypeResponses = {}));
//# sourceMappingURL=responses.js.map