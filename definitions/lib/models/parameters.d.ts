import { IQueryOption } from '../interfaces/iquery-option.interface';
export declare class ElementsParameter implements IQueryOption {
    elementCodenames: string[];
    constructor(elementCodenames: string[]);
    GetParam(): string;
    GetParamValue(): string;
}
export declare class LimitParameter implements IQueryOption {
    limit: number;
    constructor(limit: number);
    GetParam(): string;
    GetParamValue(): string;
}
export declare class SkipParameter implements IQueryOption {
    skip: number;
    constructor(skip: number);
    GetParam(): string;
    GetParamValue(): string;
}
export declare class OrderAscParameter implements IQueryOption {
    field: string;
    constructor(field: string);
    GetParam(): string;
    GetParamValue(): string;
}
export declare class OrderDescParameter implements IQueryOption {
    field: string;
    constructor(field: string);
    GetParam(): string;
    GetParamValue(): string;
}
export declare class DepthParameter implements IQueryOption {
    depth: number;
    constructor(depth: number);
    GetParam(): string;
    GetParamValue(): string;
}
