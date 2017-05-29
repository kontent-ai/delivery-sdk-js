import { IQueryOption } from '../interfaces/iquery-option.interface';

export class ElementsParameter implements IQueryOption {

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

export class LimitParameter implements IQueryOption {

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

export class SkipParameter implements IQueryOption {

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

export class OrderAscParameter implements IQueryOption {

    constructor(
        public field: string
    ) { }

    public GetParam(): string {
        return 'order';
    }

    public GetParamValue(): string {
        return `${this.field}[asc]`;
    }
}

export class OrderDescParameter implements IQueryOption {

    constructor(
        public field: string
    ) { }

    public GetParam(): string {
        return 'order';
    }

    public GetParamValue(): string {
        return `${this.field}[desc]`;
    }
}

export class DepthParameter implements IQueryOption {

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

