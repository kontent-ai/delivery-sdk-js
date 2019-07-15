import { ILinkResolverResult, Link, RichTextImage } from '..';
import { FieldContracts } from '../data-contracts';
import { FieldModels } from './field-models';
import { FieldType } from './field-type';

export namespace Fields {

    abstract class BaseField<TValue> implements FieldModels.IField<TValue> {

        /**
         * Field name
         */
        public name: string;

        /**
         * Field type
         */
        public type: FieldType;

        /**
         * Raw field value (from JSON response)
         */
        public rawData: FieldContracts.IFieldContract;

        /**
         * Mapped value of field.
         * For example, value for number elements are converted to number javascript type
         */
        public abstract value: TValue;

        constructor(data: {
            fieldWrapper: FieldModels.IFieldMapWrapper,
            fieldType: FieldType,
        }) {
            this.rawData = data.fieldWrapper.rawField;
            this.name = data.fieldWrapper.rawField.name,
                this.type = data.fieldType;
        }
    }

    export class TextField extends BaseField<string> {

        /**
         * Text value
         */
        public value: string;

        /**
        * Represents text field of Kentico Cloud item
        * @param {FieldModels.IFieldMapWrapper} fieldWrapper - Field data
        */
        constructor(
            fieldWrapper: FieldModels.IFieldMapWrapper
        ) {
            super({
                fieldType: FieldType.Text,
                fieldWrapper: fieldWrapper,
            });

            this.value = fieldWrapper.rawField.value;
        }
    }

    export class MultipleChoiceField extends BaseField<FieldModels.MultipleChoiceOption[]> {

        /**
        * Multiple choice options
        */
        public value: FieldModels.MultipleChoiceOption[] = [];

        /**
        * Represents multiple choice field of Kentico Cloud item
        * @constructor
        * @param {FieldModels.IFieldMapWrapper} fieldWrapper - Field data
        */
        constructor(
            fieldWrapper: FieldModels.IFieldMapWrapper
        ) {
            super({
                fieldType: FieldType.MultipleChoice,
                fieldWrapper: fieldWrapper,
            });

            if (fieldWrapper.rawField.value && Array.isArray(fieldWrapper.rawField.value)) {
                for (const valueItem of fieldWrapper.rawField.value) {
                    const rawOption = valueItem as FieldContracts.IMultipleChoiceOptionContract;
                    if (rawOption && rawOption.name && rawOption.codename) {
                        this.value.push(new FieldModels.MultipleChoiceOption(
                            rawOption.name,
                            rawOption.codename
                        ));
                    }
                }
            }
        }
    }

    export class DateTimeField extends BaseField<Date> {

        /**
        * Date time value
        */
        public value: Date;

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.DateTime;

        /**
        * Represents date time field of Kentico Cloud item
        * @constructor
        * @param {FieldModels.IFieldMapWrapper} fieldWrapper - Field data
        */
        constructor(
            fieldWrapper: FieldModels.IFieldMapWrapper
        ) {
            super({
                fieldType: FieldType.DateTime,
                fieldWrapper: fieldWrapper,
            });
            this.value = new Date(fieldWrapper.rawField.value);
        }
    }

    export class RichTextField extends BaseField<string> {

        /**
         * Function that is responsible for getting resolved HTML of the field
         */
        private resolveHtmlFunc: () => string;

        /**
        * Resolved html in field - store here once the html was resolved to avoid resolving it multiple times
        */
        private resolvedHtml?: string;

        /**
         * Unresolved html value of rich text element
         */
        public value: string;

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.RichText;

        /**
         * Links
         */
        public links: Link[];

        /**
         * Images included within rich text field
         */
        public images: RichTextImage[];

        /**
         * Array of linked item codenames
         */
        public linkedItemCodenames: string[];

        /**
        * Represents rich text field of Kentico Cloud item
        * @constructor
        * @param {FieldModels.IFieldMapWrapper} fieldWrapper - Field data
        * @param {string[]} linkedItemCodenames - Array of linked codenames
        */
        constructor(
            fieldWrapper: FieldModels.IFieldMapWrapper,
            linkedItemCodenames: string[],
            data: {
                resolveHtmlFunc: () => string,
                links: Link[],
                images: RichTextImage[]
            }
        ) {
            super({
                fieldType: FieldType.RichText,
                fieldWrapper: fieldWrapper,
            });

            this.linkedItemCodenames = linkedItemCodenames;
            this.resolveHtmlFunc = data.resolveHtmlFunc;
            this.links = data.links;
            this.images = data.images;

            this.value = fieldWrapper.rawField.value;
        }

        resolveHtml(): string {
            // check if html was already resolved
            if (this.resolvedHtml) {
                return this.resolvedHtml;
            }

            this.resolvedHtml = this.resolveHtmlFunc();

            return this.resolvedHtml;
        }
    }

    export class NumberField extends BaseField<number> {

        /**
        * Number value of this field
        */
        public value: number;

        /**
        * Represents number field of Kentico Cloud item
        * @constructor
        * @param {FieldModels.IFieldMapWrapper} fieldWrapper - Field data
        */
        constructor(
            fieldWrapper: FieldModels.IFieldMapWrapper
        ) {
            super({
                fieldType: FieldType.Number,
                fieldWrapper: fieldWrapper,
            });
            this.value = +fieldWrapper.rawField.value;
        }
    }

    export class AssetsField extends BaseField<FieldModels.AssetModel[]> {

        /**
        * List of assets used in this field
        */
        public value: FieldModels.AssetModel[] = [];

        /**
        * Represents asset field of Kentico Cloud item
        * @constructor
        * @param {FieldModels.IFieldMapWrapper} fieldWrapper - Field data
        */
        constructor(
            fieldWrapper: FieldModels.IFieldMapWrapper
        ) {
            super({
                fieldType: FieldType.Asset,
                fieldWrapper: fieldWrapper,
            });
            if (fieldWrapper.rawField.value && Array.isArray(fieldWrapper.rawField.value)) {
                const rawAssets = fieldWrapper.rawField.value as FieldContracts.IAssetContract[];
                for (const rawAsset of rawAssets) {
                    this.value.push(new FieldModels.AssetModel(rawAsset));
                }
            }
        }
    }

    export class UrlSlugField extends BaseField<string | undefined | ILinkResolverResult> {

        private resolvedUrl?: string | undefined | ILinkResolverResult;

        private resolveLinkFunc: () => string | undefined | ILinkResolverResult;

        public value: string | undefined | ILinkResolverResult;

        /**
        * Represents URL slug field of Kentico Cloud item
        * @constructor
        * @param {FieldModels.IFieldMapWrapper} fieldWrapper - Field data
        */
        constructor(
            fieldWrapper: FieldModels.IFieldMapWrapper,
            data: {
                /**
                 * Callback for resolving link
                 */
                resolveLinkFunc: () => string | undefined | ILinkResolverResult
            }
        ) {
            super({
                fieldType: FieldType.UrlSlug,
                fieldWrapper: fieldWrapper,
            });

            this.resolveLinkFunc = data.resolveLinkFunc;
        }

        resolveUrl(): string | undefined | ILinkResolverResult {
            if (this.resolvedUrl) {
                return this.resolvedUrl;
            }

            this.resolvedUrl = this.resolveLinkFunc();

            return this.resolvedUrl;
        }
    }

    export class TaxonomyField extends BaseField<FieldModels.TaxonomyTerm[]> {

        /**
        * List of assigned taxonomy terms
        */
        public value: FieldModels.TaxonomyTerm[] = [];

        /**
         * Taxonomy group
         */
        public taxonomyGroup: string;

        /**
        * Represents number field of Kentico Cloud item
        * @constructor
        * @param {FieldModels.IFieldMapWrapper} fieldWrapper - Field data
        */
        constructor(
            fieldWrapper: FieldModels.IFieldMapWrapper
        ) {
            super({
                fieldType: FieldType.Taxonomy,
                fieldWrapper: fieldWrapper,
            });

            if (fieldWrapper.rawField.taxonomy_group) {
                this.taxonomyGroup = fieldWrapper.rawField.taxonomy_group;
            } else {
                console.warn(`Taxonomy group for field '${fieldWrapper.rawField.name}' is invalid. Assigning empty string`);
                this.taxonomyGroup = '';
            }

            if (fieldWrapper.rawField.value && Array.isArray(fieldWrapper.rawField.value)) {
                const rawTerms = fieldWrapper.rawField.value as FieldContracts.ITaxonomyTerm[];
                for (const rawTerm of rawTerms) {
                    this.value.push(new FieldModels.TaxonomyTerm(rawTerm.name, rawTerm.codename));
                }
            }
        }
    }

    export abstract class CustomField extends BaseField<string> {

        public value: string;

        constructor(fieldWrapper: FieldModels.IFieldMapWrapper) {
            super({
                fieldType: FieldType.Custom,
                fieldWrapper: fieldWrapper
            });

            this.value = fieldWrapper.rawField.value;
        }
    }

    export class DefaultCustomField extends BaseField<string | undefined> {

        /**
         * Resolved value of custom field
         */
        public value: string | undefined;

        /**
        * Represents base custom field
        * @constructor
        * @param {FieldModels.IFieldMapWrapper} fieldWrapper - Field data
        */
        constructor(
            fieldWrapper: FieldModels.IFieldMapWrapper,
        ) {
            super({
                fieldType: FieldType.Custom,
                fieldWrapper: fieldWrapper,
            });
            this.value = fieldWrapper.rawField.value;
        }
    }
}
