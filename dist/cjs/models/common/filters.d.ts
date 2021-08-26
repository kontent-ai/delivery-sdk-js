import { IQueryParameter } from '@kentico/kontent-core';
export declare namespace Filters {
    class TypeFilter implements IQueryParameter {
        type: string | string[];
        constructor(type: string | string[]);
        getParam(): string;
    }
    class CollectionFilter implements IQueryParameter {
        collection: string | string[];
        constructor(collection: string | string[]);
        getParam(): string;
    }
    class EmptyFilter implements IQueryParameter {
        element: string;
        constructor(element: string);
        getParam(): string;
    }
    class NotEmptyFilter implements IQueryParameter {
        element: string;
        constructor(element: string);
        getParam(): string;
    }
    class EqualsFilter implements IQueryParameter {
        element: string;
        value: string;
        constructor(element: string, value: string);
        getParam(): string;
        private getParamValue;
    }
    class NotEqualsFilter implements IQueryParameter {
        element: string;
        value: string;
        constructor(element: string, value: string);
        getParam(): string;
        private getParamValue;
    }
    class AllFilter implements IQueryParameter {
        element: string;
        values: string[];
        constructor(element: string, values: string[]);
        getParam(): string;
        private getParamValue;
    }
    class AnyFilter implements IQueryParameter {
        element: string;
        values: string[];
        constructor(element: string, values: string[]);
        getParam(): string;
        private getParamValue;
    }
    class ContainsFilter implements IQueryParameter {
        element: string;
        values: string[];
        constructor(element: string, values: string[]);
        getParam(): string;
        private getParamValue;
    }
    class GreaterThanFilter implements IQueryParameter {
        element: string;
        value: string;
        constructor(element: string, value: string);
        getParam(): string;
        private getParamValue;
    }
    class GreaterThanOrEqualFilter implements IQueryParameter {
        element: string;
        value: string;
        constructor(element: string, value: string);
        getParam(): string;
        getParamValue(): string | undefined;
    }
    class InFilter implements IQueryParameter {
        element: string;
        values: string[];
        constructor(element: string, values: string[]);
        getParam(): string;
        private getParamValue;
    }
    class NotInFilter implements IQueryParameter {
        element: string;
        values: string[];
        constructor(element: string, values: string[]);
        getParam(): string;
        private getParamValue;
    }
    class LessThanFilter implements IQueryParameter {
        element: string;
        value: string;
        constructor(element: string, value: string);
        getParam(): string;
        private getParamValue;
    }
    class LessThanOrEqualFilter implements IQueryParameter {
        element: string;
        value: string;
        constructor(element: string, value: string);
        getParam(): string;
        private getParamValue;
    }
    class RangeFilter implements IQueryParameter {
        element: string;
        lowerValue: number;
        higherValue: number;
        constructor(element: string, lowerValue: number, higherValue: number);
        getParam(): string;
        private getParamValue;
    }
}
