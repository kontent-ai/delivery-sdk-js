"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementResponses = void 0;
const common_1 = require("../common");
var ElementResponses;
(function (ElementResponses) {
    class ViewContentTypeElementResponse extends common_1.BaseKontentResponseStandardDebug {
        /**
         * Response containing content type element
         *
         * @constructor
         * @param {GenericElement} element - Content type element
         */
        constructor(element, response, isDeveloperMode) {
            super(response, isDeveloperMode);
            this.element = element;
        }
    }
    ElementResponses.ViewContentTypeElementResponse = ViewContentTypeElementResponse;
})(ElementResponses = exports.ElementResponses || (exports.ElementResponses = {}));
//# sourceMappingURL=responses.js.map