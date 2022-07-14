import { IQueryParameter } from '@kontent-ai/core-sdk';

import { SortOrder } from './sort-order';

export namespace Parameters {
    const defaultValue: string = '';

    export class QueryParameter implements IQueryParameter {
        /**
         * Parameter
         * @constructor
         * @param {string} name - Name of the parameter
         * @param {string} value - Value of the parameter
         */
        constructor(public name: string, public value: string) {
            if (!name) {
                throw Error(`Name of the parameter is not specified`);
            }
        }

        getParam(): string {
            return `${this.name}=${this.value}`;
        }
    }

    export class ElementsParameter implements IQueryParameter {
        /**
         * Sets elements (projection) so that only certain elements from a content item are returned
         * @constructor
         * @param {string[]} elementCodenames - Array of element codenames to include in response.
         */
        constructor(public elementCodenames: string[]) {}

        getParam(): string {
            return `elements=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
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

    export class LimitParameter implements IQueryParameter {
        /**
         * Limits the number of items that are returned from response
         * @constructor
         * @param {number} limit - Number of elements that will be returned
         */
        constructor(public limit: number) {
            if (limit <= 0) {
                throw Error(`'LimitParameter' must specify a positive integer`);
            }
        }

        getParam(): string {
            return `limit=${this.limit}`;
        }

    }

    export class IncludeTotalCountParameter implements IQueryParameter {
        /**
         * Adds 'includeTotalCount' query parameter to query
         * @constructor
         */
        constructor() {}

        getParam(): string {
            return `includeTotalCount=true`;
        }
    }

    export class SkipParameter implements IQueryParameter {
        /**
         * Configures response to skip certain number of items
         * @constructor
         * @param {number} skip - Number of content items that will be skipped
         */
        constructor(public skip: number) {
            if (skip < 0) {
                throw Error(`'SkipParameter' must specify a positive integer number or zero."`);
            }
        }

        getParam(): string {
            return `skip=${this.skip}`;
        }
    }

    export class OrderParameter implements IQueryParameter {
        /**
         * Sorts the response based on given element.
         * @constructor
         * @param {string} element - Element that will be used for sorting (can be both elements.<elementname> or system.<elementname>)
         * @param {SortOrder} sortOrder - Order type (desc/asc). Defaults to 'asc' if SortOrder is null or invalid.
         */
        constructor(public element: string, public sortOrder: SortOrder) {
            if (!element) {
                throw Error(`Element specified in 'OrderParameter' is null or empty`);
            }
        }

        getParam(): string {
            return `order=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
            return `${this.element.trim()}[${this.sortOrder}]`;
        }
    }

    export class CustomParameter implements IQueryParameter {
        constructor(public param: string) {}

        getParam(): string {
            return this.param;
        }
    }

    export class DepthParameter implements IQueryParameter {
        /**
         * Configures the depth of the response. Content items might reference another 'linked items' using the Linked items element.
         * Recursively, these linked items can reference another linked items.
         * By default, only one level of linked content is returned.
         * @constructor
         * @param {number} depth - Depth fo the response
         */
        constructor(public depth: number) {
            if (depth < 0) {
                throw Error(`'DepthParameter' must specify a positive integer or zero`);
            }
        }

        getParam(): string {
            return `depth=${this.depth}`;
        }
    }

    export class LanguageParameter implements IQueryParameter {
        /**
         * Specifies language version to fetch
         * @constructor
         * @param {string} languageCodename - Codename of the language
         */
        constructor(public languageCodename: string) {
            if (!languageCodename) {
                throw Error(`'LanguageParameter' must specify codename of the language`);
            }
        }

        getParam(): string {
            return `language=${this.languageCodename}`;
        }
    }
}
