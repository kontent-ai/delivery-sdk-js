import { IQueryParameter } from '../../interfaces/common/iquery-parameter.interface';

export namespace Filters {

    const valueSeparator: string = ',';
    const defaultValue: string = '';

    export class TypeFilter implements IQueryParameter {
        constructor(
            public type: string | string[]
        ) {
        }

        public getParam(): string {
            if (Array.isArray(this.type)) {
                // multiple types
                return 'system.type[in]'
            }

            // single type
            return 'system.type';
        }

        public getParamValue(): string | null {
            if (!this.type) {
                return defaultValue;
            }

            if (Array.isArray(this.type)) {
                let value = '';
                // use [in] filter
                for (let i = 0; i < this.type.length; i++) {

                    value = value + this.type[i].toString();

                    if (i !== this.type.length - 1) {
                        // append separator if its not last item
                        value = value + valueSeparator;
                    }
                }

                return value;
            }

            // single type was given
            return this.type.toString();
        }
    }

    export class EqualsFilter implements IQueryParameter {
        constructor(
            public field: string,
            public value: string
        ) {
            if (!this.field) {
                throw Error(`Field specified in 'EqualsFilter' is null or empty`);
            }
        }

        public getParam(): string {

            return this.field.trim();
        }

        public getParamValue(): string | null {
            if (!this.value) {
                return defaultValue;
            }

            return this.value
        }
    }

    export class AllFilter implements IQueryParameter {
        constructor(
            public field: string,
            public values: string[]
        ) {
            if (!this.field) {
                throw Error(`Field specified in 'AllFilter' is null or empty`);
            }
        }

        public getParam(): string {
            return `${this.field.trim()}[all]`;
        }

        public getParamValue(): string | null {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }

            return this.values.map(m => m.trim()).join(',');
        }
    }

    export class AnyFilter implements IQueryParameter {
        constructor(
            public field: string,
            public values: string[]
        ) {
            if (!this.field) {
                throw Error(`Field specified in 'AnyFilter' is null or empty`);
            }
        }

        public getParam(): string {
            return `${this.field.trim()}[any]`;
        }

        public getParamValue(): string | null {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }

            return this.values.map(m => m.trim()).join(',');
        }
    }

    export class ContainsFilter implements IQueryParameter {
        constructor(
            public field: string,
            public values: string[]
        ) {
            if (!this.field) {
                throw Error(`Field specified in 'ContainsFilter' is null or empty`);
            }
        }

        public getParam(): string {
            return `${this.field.trim()}[contains]`;
        }

        public getParamValue(): string | null {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }

            return this.values.map(m => m.trim()).join(',');
        }
    }

    export class GreaterThanFilter implements IQueryParameter {
        constructor(
            public field: string,
            public value: string
        ) {
            if (!this.field) {
                throw Error(`Field specified in 'GreaterThanFilter' is null or empty`);
            }
        }

        public getParam(): string {

            return `${this.field.trim()}[gt]`;
        }

        public getParamValue(): string | null {
            if (!this.value) {
                return defaultValue;
            }

            return this.value;
        }
    }

    export class GreaterThanOrEqualFilter implements IQueryParameter {
        constructor(
            public field: string,
            public value: string
        ) {
            if (!this.field) {
                throw Error(`Field specified in 'GreaterThanOrEqualFilter' is null or empty`);
            }
        }

        public getParam(): string {

            return `${this.field.trim()}[gte]`;
        }

        public getParamValue(): string | null {
            if (!this.value) {
                return defaultValue;
            }

            return this.value;
        }
    }

    export class Infilter implements IQueryParameter {
        constructor(
            public field: string,
            public values: string[]
        ) {
            if (!this.field) {
                throw Error(`Field specified in 'Infilter' is null or empty`);
            }
        }

        public getParam(): string {
            return `${this.field.trim()}[in]`;
        }

        public getParamValue(): string | null {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }

            return this.values.map(m => {
                return m.trim()
            }
            ).join(',');
        }
    }

    export class LessThanFilter implements IQueryParameter {
        constructor(
            public field: string,
            public value: string
        ) {
            if (!this.field) {
                throw Error(`Field specified in 'LessThanFilter' is null or empty`);
            }
        }

        public getParam(): string {
            return `${this.field.trim()}[lt]`;
        }

        public getParamValue(): string | null {
            if (!this.value) {
                return defaultValue;
            }
            return this.value;
        }
    }

    export class LessThanOrEqualFilter implements IQueryParameter {
        constructor(
            public field: string,
            public value: string
        ) {
            if (!this.field) {
                throw Error(`Field specified in 'LessThanOrEqualFilter' is null or empty`);
            }
        }

        public getParam(): string {

            return `${this.field.trim()}[lte]`;
        }

        public getParamValue(): string | null {
            if (!this.value) {
                return defaultValue;
            }

            return this.value;
        }
    }

    export class RangeFilter implements IQueryParameter {
        constructor(
            public field: string,
            public lowerValue: number,
            public higherValue: number
        ) {
            if (!this.field) {
                throw Error(`Field specified in 'RangeFilter' is null or empty`);
            }

            if (lowerValue > higherValue) {
                throw Error(`'lowerValue' cannot be higher then 'higherValue' in 'RangeFilter'`);
            }
        }

        public getParam(): string {
            return `${this.field.trim()}[range]`;
        }

        public getParamValue(): string {
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
