import { IQueryParameter } from '@kontent-ai/core-sdk';

export namespace Filters {
    const valueSeparator: string = ',';
    const defaultValue: string = '';

    const getParamValueForSystemFilter = (param: string | string[]): string | undefined => {
        if (!param) {
            return defaultValue;
        }

        if (Array.isArray(param)) {
            let value = '';
            // use [in] filter
            for (let i = 0; i < param.length; i++) {
                value = value + param[i].toString();

                if (i !== param.length - 1) {
                    // append separator if its not last item
                    value = value + valueSeparator;
                }
            }

            return value;
        }

        // single param was given
        return param.toString();
    };

    export class TypeFilter implements IQueryParameter {
        constructor(public type: string | string[]) {}

        getParam(): string {
            if (Array.isArray(this.type)) {
                // multiple types
                return `system.type[in]=${getParamValueForSystemFilter(this.type)}`;
            }

            // single type
            return `system.type=${getParamValueForSystemFilter(this.type)}`;
        }
    }

    export class CollectionFilter implements IQueryParameter {
        constructor(public collection: string | string[]) {}

        getParam(): string {
            if (Array.isArray(this.collection)) {
                // multiple collections
                return `system.collection[in]=${getParamValueForSystemFilter(this.collection)}`;
            }

            // single collection
            return `system.collection=${getParamValueForSystemFilter(this.collection)}`;
        }
    }

    export class EmptyFilter implements IQueryParameter {
        constructor(public element: string) {}

        getParam(): string {
            return `${this.element.trim()}[empty]`;
        }
    }

    export class NotEmptyFilter implements IQueryParameter {
        constructor(public element: string) {}

        getParam(): string {
            return `${this.element.trim()}[nempty]`;
        }
    }

    export class EqualsFilter implements IQueryParameter {
        constructor(public element: string, public value: string) {}

        getParam(): string {
            return `${this.element.trim()}[eq]=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
            if (!this.value) {
                return defaultValue;
            }

            return this.value;
        }
    }

    export class NotEqualsFilter implements IQueryParameter {
        constructor(public element: string, public value: string) {}

        getParam(): string {
            return `${this.element.trim()}[neq]=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
            if (!this.value) {
                return defaultValue;
            }

            return this.value;
        }
    }

    export class AllFilter implements IQueryParameter {
        constructor(public element: string, public values: string[]) {}

        getParam(): string {
            return `${this.element.trim()}[all]=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }

            return this.values.map((m) => m.trim()).join(',');
        }
    }

    export class AnyFilter implements IQueryParameter {
        constructor(public element: string, public values: string[]) {}

        getParam(): string {
            return `${this.element.trim()}[any]=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }

            return this.values.map((m) => m.trim()).join(',');
        }
    }

    export class ContainsFilter implements IQueryParameter {
        constructor(public element: string, public values: string[]) {}

        getParam(): string {
            return `${this.element.trim()}[contains]=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }

            return this.values.map((m) => m.trim()).join(',');
        }
    }

    export class GreaterThanFilter implements IQueryParameter {
        constructor(public element: string, public value: string) {}

        getParam(): string {
            return `${this.element.trim()}[gt]=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
            if (!this.value) {
                return defaultValue;
            }

            return this.value;
        }
    }

    export class GreaterThanOrEqualFilter implements IQueryParameter {
        constructor(public element: string, public value: string) {}

        getParam(): string {
            return `${this.element.trim()}[gte]=${this.getParamValue()}`;
        }

        getParamValue(): string | undefined {
            if (!this.value) {
                return defaultValue;
            }

            return this.value;
        }
    }

    export class InFilter implements IQueryParameter {
        constructor(public element: string, public values: string[]) {}

        getParam(): string {
            return `${this.element.trim()}[in]=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }

            return this.values
                .map((m) => {
                    return m.trim();
                })
                .join(',');
        }
    }

    export class NotInFilter implements IQueryParameter {
        constructor(public element: string, public values: string[]) {}

        getParam(): string {
            return `${this.element.trim()}[nin]=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }

            return this.values
                .map((m) => {
                    return m.trim();
                })
                .join(',');
        }
    }

    export class LessThanFilter implements IQueryParameter {
        constructor(public element: string, public value: string) {}

        getParam(): string {
            return `${this.element.trim()}[lt]=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
            if (!this.value) {
                return defaultValue;
            }
            return this.value;
        }
    }

    export class LessThanOrEqualFilter implements IQueryParameter {
        constructor(public element: string, public value: string) {}

        getParam(): string {
            return `${this.element.trim()}[lte]=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
            if (!this.value) {
                return defaultValue;
            }

            return this.value;
        }
    }

    export class RangeFilter implements IQueryParameter {
        constructor(public element: string, public lowerValue: number, public higherValue: number) {}

        getParam(): string {
            return `${this.element.trim()}[range]=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
            let lowerVal = defaultValue;
            let higherVal = defaultValue;

            if (this.lowerValue) {
                lowerVal = this.lowerValue.toString();
            }

            if (this.higherValue) {
                higherVal = this.higherValue.toString();
            }

            return `${lowerVal},${higherVal}`;
        }
    }
}
