import { FieldInterfaces } from './field-interfaces';
import { FieldModels } from './field-models';
import { FieldType } from './field-type';

export namespace Fields {

    export class TextField implements FieldInterfaces.IField {

        /**
        * Text stored in the field
        */
        public text: string;

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.Text;

        /**
        * Represents text field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        */
        constructor(
            public name: string,
            public value: any
        ) {
            this.text = this.value;
        }
    }

    export class MultipleChoiceField implements FieldInterfaces.IField {

        /**
        * Multiple choice options
        */
        public options: FieldModels.MultipleChoiceOption[] = [];

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.MultipleChoice;

        /**
        * Represents multiple choice field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        */
        constructor(
            public name: string,
            public value: any
        ) {
            if (this.value && Array.isArray(this.value)) {
                this.value.forEach(option => {
                    const optionTemp = option as FieldInterfaces.IMultipleChoiceOption;
                    this.options.push(new FieldModels.MultipleChoiceOption(
                        optionTemp.name,
                        optionTemp.codename
                    ));
                });
            }
        }
    }

    export class DateTimeField implements FieldInterfaces.IField {

        /**
        * Date time value
        */
        public datetime: Date;

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.DateTime;

        /**
        * Represents date time field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        */
        constructor(
            public name: string,
            public value: any
        ) {
            this.datetime = new Date(value);
        }
    }

    export class RichTextField implements FieldInterfaces.IField {

        /**
         * Function that is responsible for getting resolved HTML of the field
         */
        private resolveHtml: () => string;

        /**
        * Resolved html in field - store here once the html was resolved to avoid resolving it multiple times
        */
        private resolvedHtml: string;

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.RichText;

        /**
        * Represents rich text field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        * @param {() => string} resolveHtml - Function that resolves HTML
        */
        constructor(
            public name: string,
            public value: any,
            data: {
                resolveHtml: () => string
            }
        ) {
            Object.assign(this, data);
        }

        getHtml(): string {
            // check if html was already resolved
            if (this.resolvedHtml) {
                return this.resolvedHtml;
            }

            this.resolvedHtml = this.resolveHtml();

            return this.resolvedHtml;
        }
    }

    export class NumberField implements FieldInterfaces.IField {

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.Number;

        /**
        * Number value of this field
        */
        public number: number;

        /**
        * Represents number field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        */
        constructor(
            public name: string,
            public value: any
        ) {
            this.number = value;
        }
    }

    export class AssetsField implements FieldInterfaces.IField {

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.Asset;

        /**
        * List of assets used in this field
        */
        public assets: FieldModels.AssetModel[] = [];

        /**
        * Represents asset field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {any} value - Value of the field
        */
        constructor(
            public name: string,
            public value: any
        ) {
            if (!value) {
                throw Error(`Cannot bind assets field because no value was provided`);
            }

            if (!Array.isArray(value)) {
                throw Error(`Cannot bind assets because the provided value is not an array`);
            }

            this.value.forEach((asset: FieldInterfaces.IAsset) => {
                this.assets.push(new FieldModels.AssetModel(
                    asset.name,
                    asset.type,
                    asset.size,
                    asset.description,
                    asset.url
                ));
            });
        }
    }

    export class UrlSlugField implements FieldInterfaces.IField {

        private resolvedUrl?: string;

        private resolveUrl: () => string;

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.UrlSlug;

        /**
        * Represents URL slug field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        * @param {() => string | undefined} resolveUrl - Function to get url of the link
        */
        constructor(
            public name: string,
            public value: string,
            data: {
                resolveUrl: () => string | undefined
            }
        ) {
            Object.assign(this, data);
        }

        getUrl(): string | undefined {
            if (this.resolvedUrl) {
                return this.resolvedUrl;
            }

            this.resolvedUrl = this.resolveUrl();

            return this.resolvedUrl;
        }
    }

    export class TaxonomyField implements FieldInterfaces.IField {

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.Taxonomy;

        /**
        * List of assigned taxonomy terms
        */
        public taxonomyTerms: FieldModels.TaxonomyTerm[] = [];

        /**
        * Represents number field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        * @param {string | undefined} taxonomyGroup - Codename of the taxonomy group
        */
        constructor(
            public name: string,
            public value: any,
            public taxonomyGroup: string | undefined
        ) {
            if (!value) {
                throw Error(`Cannot map taxonomy field because no value was provided`);
            }

            if (!Array.isArray(value)) {
                throw Error(`Cannot get taxonomy field because the provided value is not an array`);
            }

            const taxonomyList = value as FieldInterfaces.ITaxonomyTerm[];

            taxonomyList.forEach(term => {
                this.taxonomyTerms.push(new FieldModels.TaxonomyTerm(term.name, term.codename));
            });
        }
    }
}
