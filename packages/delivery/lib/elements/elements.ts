import { Link, RichTextImage } from '..';
import { ElementContracts } from '../data-contracts';
import { ElementModels } from './element-models';
import { ElementType } from './element-type';

export namespace Elements {

    abstract class BaseElement<TValue> implements ElementModels.IElement<TValue> {

        /**
         * Element name
         */
        public name: string;

        /**
         * Element type
         */
        public type: ElementType;

        /**
         * Raw element value (from JSON response)
         */
        public rawData: ElementContracts.IElementContract;

        /**
         * Mapped value of element.
         * For example, value for number elements are converted to number javascript type
         */
        public abstract value: TValue;

        constructor(data: {
            elementWrapper: ElementModels.IElementWrapper,
            elementType: ElementType,
        }) {
            this.rawData = data.elementWrapper.rawElement;
            this.name = data.elementWrapper.rawElement.name,
                this.type = data.elementType;
        }
    }

    export class TextElement extends BaseElement<string> {

        /**
         * Text value
         */
        public value: string;

        /**
        * Represents text element of Kentico Cloud item
        * @param {ElementModels.IElementWrapper} elementWrapper - Element data
        */
        constructor(
            elementWrapper: ElementModels.IElementWrapper
        ) {
            super({
                elementType: ElementType.Text,
                elementWrapper: elementWrapper,
            });

            this.value = elementWrapper.rawElement.value;
        }
    }

    export class MultipleChoiceElement extends BaseElement<ElementModels.MultipleChoiceOption[]> {

        /**
        * Multiple choice options
        */
        public value: ElementModels.MultipleChoiceOption[] = [];

        /**
        * Represents multiple choice element of Kentico Cloud item
        * @constructor
        * @param {ElementModels.IElementWrapper} elementWrapper - Element data
        */
        constructor(
            elementWrapper: ElementModels.IElementWrapper
        ) {
            super({
                elementType: ElementType.MultipleChoice,
                elementWrapper: elementWrapper,
            });

            if (elementWrapper.rawElement.value && Array.isArray(elementWrapper.rawElement.value)) {
                for (const valueItem of elementWrapper.rawElement.value) {
                    const rawOption = valueItem as ElementContracts.IMultipleChoiceOptionContract;
                    if (rawOption && rawOption.name && rawOption.codename) {
                        this.value.push(new ElementModels.MultipleChoiceOption(
                            rawOption.name,
                            rawOption.codename
                        ));
                    }
                }
            }
        }
    }

    export class DateTimeElement extends BaseElement<Date> {

        /**
        * Date time value
        */
        public value: Date;

        /**
        * Type of the element
        */
        public type: ElementType = ElementType.DateTime;

        /**
        * Represents date time element of Kentico Cloud item
        * @constructor
        * @param {ElementModels.IElementWrapper} elementWrapper - Element data
        */
        constructor(
            elementWrapper: ElementModels.IElementWrapper
        ) {
            super({
                elementType: ElementType.DateTime,
                elementWrapper: elementWrapper,
            });
            this.value = new Date(elementWrapper.rawElement.value);
        }
    }

    export class RichTextElement extends BaseElement<string> {

        /**
         * Function that is responsible for getting resolved HTML of the element
         */
        private resolveHtmlFunc: () => string;

        /**
        * Resolved html in element - store here once the html was resolved to avoid resolving it multiple times
        */
        private resolvedHtml?: string;

        /**
         * Unresolved html value of rich text element
         */
        public value: string;

        /**
        * Type of the element
        */
        public type: ElementType = ElementType.RichText;

        /**
         * Links
         */
        public links: Link[];

        /**
         * Images included within rich text element
         */
        public images: RichTextImage[];

        /**
         * Array of linked item codenames
         */
        public linkedItemCodenames: string[];

        /**
        * Represents rich text element of Kentico Cloud item
        * @constructor
        * @param {ElementModels.IElementWrapper} elementWrapper - Element data
        * @param {string[]} linkedItemCodenames - Array of linked codenames
        */
        constructor(
            elementWrapper: ElementModels.IElementWrapper,
            linkedItemCodenames: string[],
            data: {
                resolveHtmlFunc: () => string,
                links: Link[],
                images: RichTextImage[]
            }
        ) {
            super({
                elementType: ElementType.RichText,
                elementWrapper: elementWrapper,
            });

            this.linkedItemCodenames = linkedItemCodenames;
            this.resolveHtmlFunc = data.resolveHtmlFunc;
            this.links = data.links;
            this.images = data.images;

            this.value = elementWrapper.rawElement.value;
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

    export class NumberElement extends BaseElement<number> {

        /**
        * Number value of this element
        */
        public value: number;

        /**
        * Represents number element of Kentico Cloud item
        * @constructor
        * @param {ElementModels.IElementWrapper} elementWrapper - Element data
        */
        constructor(
            elementWrapper: ElementModels.IElementWrapper
        ) {
            super({
                elementType: ElementType.Number,
                elementWrapper: elementWrapper,
            });
            this.value = +elementWrapper.rawElement.value;
        }
    }

    export class AssetsElement extends BaseElement<ElementModels.AssetModel[]> {

        /**
        * List of assets used in this element
        */
        public value: ElementModels.AssetModel[] = [];

        /**
        * Represents asset element of Kentico Cloud item
        * @constructor
        * @param {ElementModels.IElementWrapper} elementWrapper - Element data
        */
        constructor(
            elementWrapper: ElementModels.IElementWrapper
        ) {
            super({
                elementType: ElementType.Asset,
                elementWrapper: elementWrapper,
            });
            if (elementWrapper.rawElement.value && Array.isArray(elementWrapper.rawElement.value)) {
                const rawAssets = elementWrapper.rawElement.value as ElementContracts.IAssetContract[];
                for (const rawAsset of rawAssets) {
                    this.value.push(new ElementModels.AssetModel(rawAsset));
                }
            }
        }
    }

    export class UrlSlugElement extends BaseElement<string> {

        private resolvedUrl?: string;

        private resolveLinkFunc: () => string;

        public value: string;

        /**
        * Represents URL slug element of Kentico Cloud item
        * @constructor
        * @param {ElementModels.IElementWrapper} elementWrapper - Element data
        */
        constructor(
            elementWrapper: ElementModels.IElementWrapper,
            data: {
                /**
                 * Callback for resolving link
                 */
                resolveLinkFunc: () => string
            }
        ) {
            super({
                elementType: ElementType.UrlSlug,
                elementWrapper: elementWrapper,
            });

            this.value = elementWrapper.rawElement.value;
            this.resolveLinkFunc = data.resolveLinkFunc;
        }

        resolveUrl(): string {
            if (this.resolvedUrl) {
                return this.resolvedUrl;
            }

            this.resolvedUrl = this.resolveLinkFunc();

            return this.resolvedUrl;
        }
    }

    export class TaxonomyElement extends BaseElement<ElementModels.TaxonomyTerm[]> {

        /**
        * List of assigned taxonomy terms
        */
        public value: ElementModels.TaxonomyTerm[] = [];

        /**
         * Taxonomy group
         */
        public taxonomyGroup: string;

        /**
        * Represents number element of Kentico Cloud item
        * @constructor
        * @param {ElementModels.IElementWrapper} elementWrapper - Element data
        */
        constructor(
            elementWrapper: ElementModels.IElementWrapper
        ) {
            super({
                elementType: ElementType.Taxonomy,
                elementWrapper: elementWrapper,
            });

            if (elementWrapper.rawElement.taxonomy_group) {
                this.taxonomyGroup = elementWrapper.rawElement.taxonomy_group;
            } else {
                console.warn(`Taxonomy group for element '${elementWrapper.rawElement.name}' is invalid. Assigning empty string`);
                this.taxonomyGroup = '';
            }

            if (elementWrapper.rawElement.value && Array.isArray(elementWrapper.rawElement.value)) {
                const rawTerms = elementWrapper.rawElement.value as ElementContracts.ITaxonomyTerm[];
                for (const rawTerm of rawTerms) {
                    this.value.push(new ElementModels.TaxonomyTerm(rawTerm.name, rawTerm.codename));
                }
            }
        }
    }

    export abstract class CustomElement extends BaseElement<string> {

        public value: string;

        constructor(elementWrapper: ElementModels.IElementWrapper) {
            super({
                elementType: ElementType.Custom,
                elementWrapper: elementWrapper
            });

            this.value = elementWrapper.rawElement.value;
        }
    }

    export class DefaultCustomElement extends BaseElement<string | undefined> {

        /**
         * Resolved value of custom element
         */
        public value: string | undefined;

        /**
        * Represents base custom element
        * @constructor
        * @param {ElementModels.IElementWrapper} elementWrapper - Element data
        */
        constructor(
            elementWrapper: ElementModels.IElementWrapper,
        ) {
            super({
                elementType: ElementType.Custom,
                elementWrapper: elementWrapper,
            });
            this.value = elementWrapper.rawElement.value;
        }
    }
}
