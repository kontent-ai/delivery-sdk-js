import { IQueryParameter } from '@kentico/kontent-core';
import { SortOrder } from './sort-order.enum';
export declare namespace Parameters {
    class QueryParameter implements IQueryParameter {
        name: string;
        value: string;
        /**
         * Parameter
         * @constructor
         * @param {string} name - Name of the parameter
         * @param {string} value - Value of the parameter
         */
        constructor(name: string, value: string);
        getParam(): string;
    }
    class ElementsParameter implements IQueryParameter {
        elementCodenames: string[];
        /**
         * Sets elements (projection) so that only certain elements from a content item are returned
         * @constructor
         * @param {string[]} elementCodenames - Array of element codenames to include in response.
         */
        constructor(elementCodenames: string[]);
        getParam(): string;
        private getParamValue;
    }
    class LimitParameter implements IQueryParameter {
        limit: number;
        /**
         * Limits the number of items that are returned from response
         * @constructor
         * @param {number} limit - Number of elements that will be returned
         */
        constructor(limit: number);
        getParam(): string;
    }
    class IncludeTotalCountParameter implements IQueryParameter {
        /**
         * Adds 'includeTotalCount' query parameter to query
         * @constructor
         */
        constructor();
        getParam(): string;
    }
    class SkipParameter implements IQueryParameter {
        skip: number;
        /**
         * Configures response to skip certain number of items
         * @constructor
         * @param {number} skip - Number of content items that will be skipped
         */
        constructor(skip: number);
        getParam(): string;
    }
    class OrderParameter implements IQueryParameter {
        element: string;
        sortOrder: SortOrder;
        /**
         * Sorts the response based on given element.
         * @constructor
         * @param {string} element - Element that will be used for sorting (can be both elements.<elementname> or system.<elementname>)
         * @param {SortOrder} sortOrder - Order type (desc/asc). Defaults to 'asc' if SortOrder is null or invalid.
         */
        constructor(element: string, sortOrder: SortOrder);
        getParam(): string;
        private getParamValue;
    }
    class CustomParameter implements IQueryParameter {
        param: string;
        constructor(param: string);
        getParam(): string;
    }
    class DepthParameter implements IQueryParameter {
        depth: number;
        /**
         * Configures the depth of the response. Content items might reference another 'linked items' using the Linked items element.
         * Recursively, these linked items can reference another linked items.
         * By default, only one level of linked content is returned.
         * @constructor
         * @param {number} depth - Depth fo the response
         */
        constructor(depth: number);
        getParam(): string;
    }
    class LanguageParameter implements IQueryParameter {
        languageCodename: string;
        /**
         * Specifies language version to fetch
         * @constructor
         * @param {string} languageCodename - Codename of the language
         */
        constructor(languageCodename: string);
        getParam(): string;
    }
}
