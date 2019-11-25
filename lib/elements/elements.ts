import { Link, RichTextImage } from '..';
import { ElementContracts } from '../data-contracts';
import { IContentItem } from '../models';
import { ElementModels } from './element-models';
import { ElementType } from './element-type';

export namespace Elements {
    export abstract class BaseElement<TValue> implements ElementModels.IElement<TValue> {
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

        constructor(data: { elementWrapper: ElementModels.IElementWrapper; elementType: ElementType }) {
            this.rawData = data.elementWrapper.rawElement;
            this.name = data.elementWrapper.rawElement.name;
            this.type = data.elementType;
        }
    }

    export class TextElement extends BaseElement<string> {
        /**
         * Text value
         */
        public value: string;

        /**
         * Represents text element of Kentico Kontent item
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper: ElementModels.IElementWrapper) {
            super({
                elementType: ElementType.Text,
                elementWrapper: elementWrapper
            });

            this.value = elementWrapper.rawElement.value;
        }
    }

    export class LinkedItemsElement<TItem = IContentItem> extends BaseElement<TItem[]> {
        /**
         * Mapped linked items - contains only those items which are present in 'modular_content' section
         * of the response which depends on the 'depth' of the query request.
         * Codenames of all linked items are stored in 'itemCodenames' property.
         */
        public value: TItem[];

        public itemCodenames: string[];

        /**
         * Represents text element of Kentico Kontent item
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         * @param {IContentItem} mappedLinkedItems - Array of mapped linked items
         */
        constructor(elementWrapper: ElementModels.IElementWrapper, mappedLinkedItems: TItem[]) {
            super({
                elementType: ElementType.ModularContent,
                elementWrapper: elementWrapper
            });

            this.itemCodenames = elementWrapper.rawElement.value;
            this.value = mappedLinkedItems;
        }
    }

    export class MultipleChoiceElement extends BaseElement<ElementModels.MultipleChoiceOption[]> {
        /**
         * Multiple choice options
         */
        public value: ElementModels.MultipleChoiceOption[] = [];

        /**
         * Represents multiple choice element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper: ElementModels.IElementWrapper) {
            super({
                elementType: ElementType.MultipleChoice,
                elementWrapper: elementWrapper
            });

            if (elementWrapper.rawElement.value && Array.isArray(elementWrapper.rawElement.value)) {
                for (const valueItem of elementWrapper.rawElement.value) {
                    const rawOption = valueItem as ElementContracts.IMultipleChoiceOptionContract;
                    if (rawOption && rawOption.name && rawOption.codename) {
                        this.value.push(new ElementModels.MultipleChoiceOption(rawOption.name, rawOption.codename));
                    }
                }
            }
        }
    }

    export class DateTimeElement extends BaseElement<Date | null> {
        /**
         * Date time value
         */
        public value: Date | null;

        /**
         * Type of the element
         */
        public type: ElementType = ElementType.DateTime;

        /**
         * Represents date time element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper: ElementModels.IElementWrapper) {
            super({
                elementType: ElementType.DateTime,
                elementWrapper: elementWrapper
            });
            if (elementWrapper.rawElement.value) {
                this.value = new Date(elementWrapper.rawElement.value);
            } else {
                this.value = null;
            }
        }
    }

    export class RichTextElement extends BaseElement<string> {
        /**
         * Function that is responsible for getting resolved HTML of the element
         */
        private resolveRichTextFunc: () => ElementModels.IRichTextResolverData;

        /**
         * Resolved rich text element result
         */
        private resolvedData?: ElementModels.IRichTextResolverData;

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
         * Represents rich text element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         * @param {string[]} linkedItemCodenames - Array of linked codenames
         */
        constructor(
            elementWrapper: ElementModels.IElementWrapper,
            linkedItemCodenames: string[],
            data: {
                resolveRichTextFunc: () => ElementModels.IRichTextResolverData;
                links: Link[];
                images: RichTextImage[];
            }
        ) {
            super({
                elementType: ElementType.RichText,
                elementWrapper: elementWrapper
            });

            this.linkedItemCodenames = linkedItemCodenames;
            this.resolveRichTextFunc = data.resolveRichTextFunc;
            this.links = data.links;
            this.images = data.images;

            this.value = elementWrapper.rawElement.value;
        }

        resolveData(): ElementModels.IRichTextResolverData {
            if (this.resolvedData) {
                return this.resolvedData;
            }
            this.resolvedData = this.resolveRichTextFunc();

            return this.resolvedData;
        }

        resolveHtml(): string {
            if (this.resolvedData) {
                return this.resolvedData.html;
            }

            this.resolvedData = this.resolveRichTextFunc();

            return this.resolvedData.html;
        }
    }

    export class NumberElement extends BaseElement<number | null> {
        /**
         * Number value of this element
         */
        public value: number | null;

        /**
         * Represents number element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper: ElementModels.IElementWrapper) {
            super({
                elementType: ElementType.Number,
                elementWrapper: elementWrapper
            });
            if (elementWrapper.rawElement.value === 0) {
                this.value = 0;
            } else if (elementWrapper.rawElement.value) {
                this.value = +elementWrapper.rawElement.value;
            } else {
                this.value = null;
            }
        }
    }

    export class AssetsElement extends BaseElement<ElementModels.AssetModel[]> {
        /**
         * List of assets used in this element
         */
        public value: ElementModels.AssetModel[] = [];

        /**
         * Represents asset element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper: ElementModels.IElementWrapper) {
            super({
                elementType: ElementType.Asset,
                elementWrapper: elementWrapper
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
         * Represents URL slug element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(
            elementWrapper: ElementModels.IElementWrapper,
            data: {
                /**
                 * Callback for resolving link
                 */
                resolveLinkFunc: () => string;
            }
        ) {
            super({
                elementType: ElementType.UrlSlug,
                elementWrapper: elementWrapper
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
         * Represents number element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper: ElementModels.IElementWrapper) {
            super({
                elementType: ElementType.Taxonomy,
                elementWrapper: elementWrapper
            });

            if (elementWrapper.rawElement.taxonomy_group) {
                this.taxonomyGroup = elementWrapper.rawElement.taxonomy_group;
            } else {
                console.warn(
                    `Taxonomy group for element '${elementWrapper.rawElement.name}' is invalid. Assigning empty string`
                );
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

    export class UnknownElement extends BaseElement<any> {
        public value: any;

        constructor(elementWrapper: ElementModels.IElementWrapper) {
            super({
                elementType: ElementType.Unknown,
                elementWrapper: elementWrapper
            });

            this.value = elementWrapper.rawElement.value;
        }
    }

    export abstract class CustomElement extends BaseElement<string | null> {
        public value: string | null;

        constructor(elementWrapper: ElementModels.IElementWrapper) {
            super({
                elementType: ElementType.Custom,
                elementWrapper: elementWrapper
            });

            this.value = elementWrapper.rawElement.value;
        }
    }

    export class DefaultCustomElement extends BaseElement<string | null> {
        /**
         * Resolved value of custom element
         */
        public value: string | null;

        /**
         * Represents base custom element
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper: ElementModels.IElementWrapper) {
            super({
                elementType: ElementType.Custom,
                elementWrapper: elementWrapper
            });
            this.value = elementWrapper.rawElement.value;
        }
    }
}
