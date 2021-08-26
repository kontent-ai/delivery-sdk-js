import { BaseKontentResponseStandardDebug } from '../common';
export var ElementResponses;
(function (ElementResponses) {
    class ViewContentTypeElementResponse extends BaseKontentResponseStandardDebug {
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
})(ElementResponses || (ElementResponses = {}));
//# sourceMappingURL=responses.js.map