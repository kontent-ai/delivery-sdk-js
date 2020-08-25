import { IQueryParameter } from '@kentico/kontent-core';

export namespace Filters {

    const valueSeparator: string = ',';
    const defaultValue: string = '';

    export class TypeFilter implements IQueryParameter {
        constructor(
            public type: string | string[]
        ) {
        }

        getParam(): string {
            if (Array.isArray(this.type)) {
                // multiple types
                return `system.type[in]=${this.getParamValue()}`;
            }

            // single type
            return `system.type=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
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

    export class EmptyFilter implements IQueryParameter {
        constructor(
            public element: string,
        ) {
            if (!this.element) {
                throw Error(`Element specified in 'EmptyFilter' is undefined `);
            }
        }

        getParam(): string {
            return `${this.element.trim()}[empty]`;
        }
    }

    export class NotEmptyFilter implements IQueryParameter {
        constructor(
            public element: string,
        ) {
            if (!this.element) {
                throw Error(`Element specified in 'NotEmptyFilter' is undefined `);
            }
        }

        getParam(): string {
            return `${this.element.trim()}[nempty]`;
        }
    }

    export class EqualsFilter implements IQueryParameter {
        constructor(
            public element: string,
            public value: string
        ) {
            if (!this.element) {
                throw Error(`Element specified in 'EqualsFilter' is undefined `);
            }
        }

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
        constructor(
            public element: string,
            public value: string
        ) {
            if (!this.element) {
                throw Error(`Element specified in 'NotEqualsFilter' is undefined `);
            }
        }

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
        constructor(
            public element: string,
            public values: string[]
        ) {
            if (!this.element) {
                throw Error(`Element specified in 'AllFilter' is undefined `);
            }
        }

        getParam(): string {
            return `${this.element.trim()}[all]=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }

            return this.values.map(m => m.trim()).join(',');
        }
    }

    export class AnyFilter implements IQueryParameter {
        constructor(
            public element: string,
            public values: string[]
        ) {
            if (!this.element) {
                throw Error(`Element specified in 'AnyFilter' is undefined `);
            }
        }

        getParam(): string {
            return `${this.element.trim()}[any]=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }

            return this.values.map(m => m.trim()).join(',');
        }
    }

    export class ContainsFilter implements IQueryParameter {
        constructor(
            public element: string,
            public values: string[]
        ) {
            if (!this.element) {
                throw Error(`Element specified in 'ContainsFilter' is undefined `);
            }
        }

        getParam(): string {
            return `${this.element.trim()}[contains]=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }

            return this.values.map(m => m.trim()).join(',');
        }
    }

    export class GreaterThanFilter implements IQueryParameter {
        constructor(
            public element: string,
            public value: string
        ) {
            if (!this.element) {
                throw Error(`Element specified in 'GreaterThanFilter' is undefined `);
            }
        }

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
        constructor(
            public element: string,
            public value: string
        ) {
            if (!this.element) {
                throw Error(`Element specified in 'GreaterThanOrEqualFilter' is undefined `);
            }
        }

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
        constructor(
            public element: string,
            public values: string[]
        ) {
            if (!this.element) {
                throw Error(`Element specified in 'Infilter' is undefined`);
            }
        }

        getParam(): string {
            return `${this.element.trim()}[in]=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }

            return this.values.map(m => {
                return m.trim();
            }
            ).join(',');
        }
    }

    export class NotInFilter implements IQueryParameter {
        constructor(
            public element: string,
            public values: string[]
        ) {
            if (!this.element) {
                throw Error(`Element specified in 'NotInFilter' is undefined`);
            }
        }

        getParam(): string {
            return `${this.element.trim()}[nin]=${this.getParamValue()}`;
        }

        private getParamValue(): string | undefined {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }

            return this.values.map(m => {
                return m.trim();
            }
            ).join(',');
        }
    }

    export class LessThanFilter implements IQueryParameter {
        constructor(
            public element: string,
            public value: string
        ) {
            if (!this.element) {
                throw Error(`Element specified in 'LessThanFilter' is undefined `);
            }
        }

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
        constructor(
            public element: string,
            public value: string
        ) {
            if (!this.element) {
                throw Error(`Element specified in 'LessThanOrEqualFilter' is undefined `);
            }
        }

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
        constructor(
            public element: string,
            public lowerValue: number,
            public higherValue: number
        ) {
            if (!this.element) {
                throw Error(`Element specified in 'RangeFilter' is undefined `);
            }

            if (lowerValue > higherValue) {
                throw Error(`'lowerValue' cannot be higher then 'higherValue' in 'RangeFilter'`);
            }
        }

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
