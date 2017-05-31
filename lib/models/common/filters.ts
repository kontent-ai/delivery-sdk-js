import { IQueryParameter } from '../../interfaces/common/iquery-parameter.interface';

export class EqualsFilter implements IQueryParameter {
    constructor(
        public field: string,
        public value: string
    ) { }

    public GetParam(): string {
        if (!this.field){
            throw Error(`Cannot apply 'EqualsFilter' due to invalid field parameter`);
        }
        return this.field;
    }

    public GetParamValue(): string {
        if (!this.value){
            return null;
        }

        return this.value
    }
}

export class AllFilter implements IQueryParameter {
    constructor(
        public field: string,
        public values: string[]
    ) { }

    public GetParam(): string {
        if (!this.field){
            throw Error(`Cannot apply 'AllFilter' due to invalid field parameter`);
        }
        return `${this.field}[all]`;
    }

    public GetParamValue(): string {
        if (!this.values){
            return null;
        }

        return this.values.map(m => m.trim()).join(',');
    }
}

export class AnyFilter implements IQueryParameter {
  constructor(
        public field: string,
        public values: string[]
    ) { }

    public GetParam(): string {
        if (!this.field){
            throw Error(`Cannot apply 'AnyFilter' due to invalid field parameter`);
        }
        return `${this.field}[any]`;
    }

    public GetParamValue(): string {
        if (!this.values){
            return null;
        }

        return this.values.map(m => m.trim()).join(',');
    }
}

export class ContainsFilter implements IQueryParameter {
      constructor(
        public field: string,
        public values: string[]
    ) { }

    public GetParam(): string {
        if (!this.field){
            throw Error(`Cannot apply 'ContainsFilter' due to invalid field parameter`);
        }
        return `${this.field}[contains]`;
    }

    public GetParamValue(): string {
        if (!this.values){
            return null;
        }

        return this.values.map(m => m.trim()).join(',');
    }
}

export class GreaterThanFilter implements IQueryParameter {
    constructor(
        public field: string,
        public value: string
    ) { }

    public GetParam(): string {
        if (!this.field){
            throw Error(`Cannot apply 'GreaterThanFilter' due to invalid field parameter`);
        }
        return `${this.field}[gt]`;
    }

    public GetParamValue(): string {
        if (!this.value){
            return null;
        }

        return this.value;
    }
}

export class GreaterThanOrEqualFilter implements IQueryParameter {
     constructor(
        public field: string,
        public value: string
    ) { }

    public GetParam(): string {
        if (!this.field){
            throw Error(`Cannot apply 'GreaterThanOrEqualFilter' due to invalid field parameter`);
        }
        return `${this.field}[gte]`;
    }

    public GetParamValue(): string {
        if (!this.value){
            return null;
        }

        return this.value;
    }
}

export class Infilter implements IQueryParameter {
    constructor(
        public field: string,
        public values: string[]
    ) { }

    public GetParam(): string {
        if (!this.field){
            throw Error(`Cannot apply 'Infilter' due to invalid field parameter`);
        }
        return `${this.field}[in]`;
    }

    public GetParamValue(): string {
        if (!this.values){
            return null;
        }

        return this.values.map(m => m.trim()).join(',');
    }
}

export class LessThanFilter implements IQueryParameter {
     constructor(
        public field: string,
        public value: string
    ) { }

    public GetParam(): string {
        if (!this.field){
            throw Error(`Cannot apply 'LessThanFilter' due to invalid field parameter`);
        }
        return `${this.field}[lt]`;
    }

    public GetParamValue(): string {
        if (!this.value){
            return null;
        }

        return this.value;
    }
}

export class LessThanOrEqualFilter implements IQueryParameter {
    constructor(
        public field: string,
        public value: string
    ) { }

    public GetParam(): string {
        if (!this.field){
            throw Error(`Cannot apply 'LessThanOrEqualFilter' due to invalid field parameter`);
        }
        return `${this.field}[lte]`;
    }

    public GetParamValue(): string {
        if (!this.value){
            return null;
        }

        return this.value;
    }
}

export class RangeFilter implements IQueryParameter {
     constructor(
        public field: string,
        public lowerValue: number,
        public higherValue: number
    ) { }

    public GetParam(): string {
        if (!this.field){
            throw Error(`Cannot apply 'RangeFilter' due to invalid field parameter`);
        }
        return `${this.field}[range]`;
    }

    public GetParamValue(): string {
        if (!this.lowerValue){
            return null;
        }

        if (!this.higherValue){
            return null;
        }

        return `${this.lowerValue},${this.higherValue}`;
    }
}
