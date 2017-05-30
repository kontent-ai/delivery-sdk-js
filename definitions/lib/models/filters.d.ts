import { IQueryOption } from '../interfaces/iquery-option.interface';
export declare class EqualsFilter implements IQueryOption {
    field: string;
    value: string;
    constructor(field: string, value: string);
    GetParam(): string;
    GetParamValue(): string;
}
export declare class AllFilter implements IQueryOption {
    field: string;
    values: string[];
    constructor(field: string, values: string[]);
    GetParam(): string;
    GetParamValue(): string;
}
export declare class AnyFilter implements IQueryOption {
    field: string;
    values: string[];
    constructor(field: string, values: string[]);
    GetParam(): string;
    GetParamValue(): string;
}
export declare class ContainsFilter implements IQueryOption {
    field: string;
    values: string[];
    constructor(field: string, values: string[]);
    GetParam(): string;
    GetParamValue(): string;
}
export declare class GreaterThanFilter implements IQueryOption {
    field: string;
    value: string;
    constructor(field: string, value: string);
    GetParam(): string;
    GetParamValue(): string;
}
export declare class GreaterThanOrEqualFilter implements IQueryOption {
    field: string;
    value: string;
    constructor(field: string, value: string);
    GetParam(): string;
    GetParamValue(): string;
}
export declare class Infilter implements IQueryOption {
    field: string;
    values: string[];
    constructor(field: string, values: string[]);
    GetParam(): string;
    GetParamValue(): string;
}
export declare class LessThanFilter implements IQueryOption {
    field: string;
    value: string;
    constructor(field: string, value: string);
    GetParam(): string;
    GetParamValue(): string;
}
export declare class LessThanOrEqualFilter implements IQueryOption {
    field: string;
    value: string;
    constructor(field: string, value: string);
    GetParam(): string;
    GetParamValue(): string;
}
export declare class RangeFilter implements IQueryOption {
    field: string;
    lowerValue: number;
    higherValue: number;
    constructor(field: string, lowerValue: number, higherValue: number);
    GetParam(): string;
    GetParamValue(): string;
}
