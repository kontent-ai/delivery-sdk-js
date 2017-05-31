import { IQueryParameter } from '../../interfaces/common/iquery-parameter.interface';
import { SortOrder } from './sort-order.enum';

export class ElementsParameter implements IQueryParameter {

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

