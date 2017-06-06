import { IQueryParameter } from '../../interfaces/common/iquery-parameter.interface';
import { SortOrder } from './sort-order.enum';

export class ElementsParameter implements IQueryParameter {

    /**
    * Sets elements (projection) so that only certain elements from a content item are returned
    * @constructor
    * @param {string[]} elementCodenames - Array of element codenames to include in response.
    */
    constructor(
        public elementCodenames: string[]
    ) { }

    public GetParam(): string {
        return 'elements';
    }

    public GetParamValue(): string {
        if (!this.elementCodenames) {
            return null;
        }

        return this.elementCodenames.map(m => m.trim()).join();
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
    ) { }

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
    ) { }

    public GetParam(): string {
        return 'skip';
    }

    public GetParamValue(): string {
        return this.skip.toString();
    }
}

export class OrderParameter implements IQueryParameter {

    /**
    * Sorts the response based on given field
    * @constructor
    * @param {number} field - Field that will be used for sorting (can be both elements.<fieldname> or system.<fieldname>)
    * @param {number} sortOrder - Order type (desc/asc)
    */
    constructor(
        public field: string,
        public sortOrder: SortOrder
    ) { }

    public GetParam(): string {
        return 'order';
    }

    public GetParamValue(): string {
        var order: string;
        if (this.sortOrder == SortOrder.asc){
            order = "asc";
        }
        else{
            order = "desc";
        }
        return `${this.field}[${order}]`;
    }
}


export class DepthParameter implements IQueryParameter {

    /**
    * Configured the depth of the response. Content items might reference modular content items using the Modular content element. 
    * Recursively, these modular content items can reference another modular content items. 
    * By default, only one level of modular content is returned.
    * @constructor
    * @param {number} field - Field that will be used for sorting (can be both elements.<fieldname> or system.<fieldname>)
    * @param {number} sortOrder - Order type (desc/asc)
    */
    constructor(
        public depth: number
    ) { }

    public GetParam(): string {
        return 'depth';
    }

    public GetParamValue(): string {
        return this.depth.toString();
    }
}

