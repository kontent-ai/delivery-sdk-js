import { IQueryParameter } from '../../interfaces/common/iquery-parameter.interface';
import { SortOrder } from './sort-order.enum';

export namespace Parameters {

    var defaultValue: string = '';
    
    export class ElementsParameter implements IQueryParameter {

        /**
        * Sets elements (projection) so that only certain elements from a content item are returned
        * @constructor
        * @param {string[]} elementCodenames - Array of element codenames to include in response.
        */
        constructor(
            public elementCodenames: string[]
        ) {
            
        }

        public GetParam(): string {
            return 'elements';
        }

        public GetParamValue(): string {
            if (!this.elementCodenames) {
                return defaultValue;
            }

            return this.elementCodenames.map(m => {
                if (!m) {
                    throw Error(`Codename of 'ElementsParameter' cannot be null or empty`);
                }
                return m.trim()
            }).join(',');
        }
    }

    export class LimitParameter implements IQueryParameter {

        /**
        * Limits the number of items that are returned from response
        * @constructor
        * @param {number} limit - Number of elements that will be returned
        */
        constructor(
            public limit: number
        ) {
            if (limit <= 0) {
                throw Error(`'LimitParameter' must specify a positive integer`);
            }
        }

        public GetParam(): string {
            return 'limit';
        }

        public GetParamValue(): string {
            return this.limit.toString();
        }
    }

    export class SkipParameter implements IQueryParameter {

        /**
        * Configures response to skip certain number of items
        * @constructor
        * @param {number} skip - Number of content items that will be skipped 
        */
        constructor(
            public skip: number
        ) {
            if (skip < 0) {
                throw Error(`'SkipParameter' must specify a positive integer number or zero."`);
            }
        }

        public GetParam(): string {
            return 'skip';
        }

        public GetParamValue(): string {
            return this.skip.toString();
        }
    }

    export class OrderParameter implements IQueryParameter {

        /**
        * Sorts the response based on given field. 
        * @constructor
        * @param {string} field - Field that will be used for sorting (can be both elements.<fieldname> or system.<fieldname>)
        * @param {SortOrder} sortOrder - Order type (desc/asc). Defaults to 'asc' if SortOrder is null or invalid.
        */
        constructor(
            public field: string,
            public sortOrder: SortOrder
        ) {
            if (!field) {
                throw Error(`Field specified in 'OrderParameter' is null or empty`);
            }
        }

        public GetParam(): string {
            return 'order';
        }

        public GetParamValue(): string {
            var order: string;
            if (this.sortOrder == SortOrder.desc) {
                order = "desc";
            }
            else {
                order = "asc";
            }
            return `${this.field.trim()}[${order}]`;
        }
    }

    export class DepthParameter implements IQueryParameter {

        /**
        * Configures the depth of the response. Content items might reference modular content items using the Modular content element. 
        * Recursively, these modular content items can reference another modular content items. 
        * By default, only one level of modular content is returned.
        * @constructor
        * @param {number} depth - Depth fo the response
        */
        constructor(
            public depth: number
        ) {
            if (depth < 0) {
                throw Error(`'DepthParameter' must specify a positive integer or zero`);
            }
        }

        public GetParam(): string {
            return 'depth';
        }

        public GetParamValue(): string {
            return this.depth.toString();
        }
    }

    export class LanguageParameter implements IQueryParameter {

        /**
        * Specifies language version to fetch
        * @constructor
        * @param {string} languageCodename - Codename of the language
        */
        constructor(
            public languageCodename: string
        ) {
            if (!languageCodename) {
                throw Error(`'LanguageParameter' must specify codename of the language`);
            }
        }

        public GetParam(): string {
            return 'language';
        }

        public GetParamValue(): string {
            return this.languageCodename.trim().toString();
        }
    }
}

