"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parameters = void 0;
const sort_order_enum_1 = require("./sort-order.enum");
var Parameters;
(function (Parameters) {
    const defaultValue = '';
    class QueryParameter {
        /**
         * Parameter
         * @constructor
         * @param {string} name - Name of the parameter
         * @param {string} value - Value of the parameter
         */
        constructor(name, value) {
            this.name = name;
            this.value = value;
            if (!name) {
                throw Error(`Name of the parameter is not specified`);
            }
        }
        getParam() {
            return `${this.name}=${this.value}`;
        }
    }
    Parameters.QueryParameter = QueryParameter;
    class ElementsParameter {
        /**
         * Sets elements (projection) so that only certain elements from a content item are returned
         * @constructor
         * @param {string[]} elementCodenames - Array of element codenames to include in response.
         */
        constructor(elementCodenames) {
            this.elementCodenames = elementCodenames;
        }
        getParam() {
            return `elements=${this.getParamValue()}`;
        }
        getParamValue() {
            if (!this.elementCodenames) {
                return defaultValue;
            }
            return this.elementCodenames
                .map((m) => {
                if (!m) {
                    throw Error(`Codename of 'ElementsParameter' cannot be null or empty`);
                }
                return m.trim();
            })
                .join(',');
        }
    }
    Parameters.ElementsParameter = ElementsParameter;
    class LimitParameter {
        /**
         * Limits the number of items that are returned from response
         * @constructor
         * @param {number} limit - Number of elements that will be returned
         */
        constructor(limit) {
            this.limit = limit;
            if (limit <= 0) {
                throw Error(`'LimitParameter' must specify a positive integer`);
            }
        }
        getParam() {
            return `limit=${this.limit}`;
        }
    }
    Parameters.LimitParameter = LimitParameter;
    class IncludeTotalCountParameter {
        /**
         * Adds 'includeTotalCount' query parameter to query
         * @constructor
         */
        constructor() { }
        getParam() {
            return `includeTotalCount=true`;
        }
    }
    Parameters.IncludeTotalCountParameter = IncludeTotalCountParameter;
    class SkipParameter {
        /**
         * Configures response to skip certain number of items
         * @constructor
         * @param {number} skip - Number of content items that will be skipped
         */
        constructor(skip) {
            this.skip = skip;
            if (skip < 0) {
                throw Error(`'SkipParameter' must specify a positive integer number or zero."`);
            }
        }
        getParam() {
            return `skip=${this.skip}`;
        }
    }
    Parameters.SkipParameter = SkipParameter;
    class OrderParameter {
        /**
         * Sorts the response based on given element.
         * @constructor
         * @param {string} element - Element that will be used for sorting (can be both elements.<elementname> or system.<elementname>)
         * @param {SortOrder} sortOrder - Order type (desc/asc). Defaults to 'asc' if SortOrder is null or invalid.
         */
        constructor(element, sortOrder) {
            this.element = element;
            this.sortOrder = sortOrder;
            if (!element) {
                throw Error(`Element specified in 'OrderParameter' is null or empty`);
            }
        }
        getParam() {
            return `order=${this.getParamValue()}`;
        }
        getParamValue() {
            let order;
            if (this.sortOrder === sort_order_enum_1.SortOrder.desc) {
                order = 'desc';
            }
            else {
                order = 'asc';
            }
            return `${this.element.trim()}[${order}]`;
        }
    }
    Parameters.OrderParameter = OrderParameter;
    class CustomParameter {
        constructor(param) {
            this.param = param;
        }
        getParam() {
            return this.param;
        }
    }
    Parameters.CustomParameter = CustomParameter;
    class DepthParameter {
        /**
         * Configures the depth of the response. Content items might reference another 'linked items' using the Linked items element.
         * Recursively, these linked items can reference another linked items.
         * By default, only one level of linked content is returned.
         * @constructor
         * @param {number} depth - Depth fo the response
         */
        constructor(depth) {
            this.depth = depth;
            if (depth < 0) {
                throw Error(`'DepthParameter' must specify a positive integer or zero`);
            }
        }
        getParam() {
            return `depth=${this.depth}`;
        }
    }
    Parameters.DepthParameter = DepthParameter;
    class LanguageParameter {
        /**
         * Specifies language version to fetch
         * @constructor
         * @param {string} languageCodename - Codename of the language
         */
        constructor(languageCodename) {
            this.languageCodename = languageCodename;
            if (!languageCodename) {
                throw Error(`'LanguageParameter' must specify codename of the language`);
            }
        }
        getParam() {
            return `language=${this.languageCodename}`;
        }
    }
    Parameters.LanguageParameter = LanguageParameter;
})(Parameters = exports.Parameters || (exports.Parameters = {}));
//# sourceMappingURL=parameters.js.map