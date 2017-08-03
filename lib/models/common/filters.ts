import { IQueryParameter } from '../../interfaces/common/iquery-parameter.interface';

export namespace Filters {
    
    export class EqualsFilter implements IQueryParameter {
        constructor(
            public field: string,
            public value: string
        ) {
            if (!this.field) {
                throw Error(`Field specified in 'EqualsFilter' is null or empty`);
            }
        }

        public GetParam(): string {

            return this.field.trim();
        }

        public GetParamValue(): string | null{
            if (!this.value) {
                return null;
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

        public GetParam(): string {
            return `${this.field.trim()}[all]`;
        }

        public GetParamValue(): string | null{
            if (!this.values) {
                return null;
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

        public GetParam(): string {
            return `${this.field.trim()}[any]`;
        }

        public GetParamValue(): string | null{
            if (!this.values) {
                return null;
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

        public GetParam(): string {
            return `${this.field.trim()}[contains]`;
        }

        public GetParamValue(): string | null{
            if (!this.values) {
                return null;
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

        public GetParam(): string {

            return `${this.field.trim()}[gt]`;
        }

        public GetParamValue(): string | null{
            if (!this.value) {
                return null;
            }

            return this.value;
        }
    }

    export class GreaterThanOrEqualFilter implements IQueryParameter {
        constructor(
            public field: string,
            public value: string
        ) {
            if (!this.field.trim) {
                throw Error(`Field specified in 'GreaterThanOrEqualFilter' is null or empty`);
            }
        }

        public GetParam(): string {

            return `${this.field.trim()}[gte]`;
        }

        public GetParamValue(): string | null{
            if (!this.value) {
                return null;
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

        public GetParam(): string {
            return `${this.field.trim()}[in]`;
        }

        public GetParamValue(): string | null{
            if (!this.values) {
                return null;
            }

            return this.values.map(m => {
                if (!m) {
                    throw Error(`Elements in 'InFilter' cannot be null or empty`);
                }
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

        public GetParam(): string {
            return `${this.field.trim()}[lt]`;
        }

        public GetParamValue(): string | null{
            if (!this.value) {
                return null;
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

        public GetParam(): string {

            return `${this.field.trim()}[lte]`;
        }

        public GetParamValue(): string | null{
            if (!this.value) {
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
        ) {
            if (!this.field) {
                throw Error(`Field specified in 'RangeFilter' is null or empty`);
            }

            if (lowerValue > higherValue) {
                throw Error(`'lowerValue' cannot be higher then 'higherValue' in 'RangeFilter'`);
            }
        }

        public GetParam(): string {
            return `${this.field.trim()}[range]`;
        }

        public GetParamValue(): string | null{
            if (!this.lowerValue) {
                return null;
            }

            if (!this.higherValue) {
                return null;
            }

            return `${this.lowerValue},${this.higherValue}`;
        }
    }
}
