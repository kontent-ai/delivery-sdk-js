import { IQueryParameter } from './url.models';

export namespace Parameters {
    export class CustomParameter implements IQueryParameter {
        /**
         * Custom parameter
         * @constructor
         * @param {string} name - Name of the parameter
         * @param {string} value - Value of the parameter
         */
        constructor(public name: string, public value: string) {
            if (!name) {
                throw Error(`Name of the custom parameter is not specified`);
            }
        }

        public getParam(): string {
            return this.name;
        }

        public getParamValue(): string {
            return this.value;
        }
    }
}
