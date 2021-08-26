"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Elements = void 0;
const element_models_1 = require("./element-models");
const element_type_1 = require("./element-type");
var Elements;
(function (Elements) {
    class BaseElement {
        constructor(data) {
            this.rawData = data.elementWrapper.rawElement;
            this.name = data.elementWrapper.rawElement.name;
            this.type = data.elementType;
        }
    }
    Elements.BaseElement = BaseElement;
    class TextElement extends BaseElement {
        /**
         * Represents text element of Kentico Kontent item
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper) {
            super({
                elementType: element_type_1.ElementType.Text,
                elementWrapper: elementWrapper
            });
            this.value = elementWrapper.rawElement.value;
        }
    }
    Elements.TextElement = TextElement;
    class LinkedItemsElement extends BaseElement {
        /**
         * Represents text element of Kentico Kontent item
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         * @param {IContentItem} mappedLinkedItems - Array of mapped linked items
         */
        constructor(elementWrapper, mappedLinkedItems) {
            super({
                elementType: element_type_1.ElementType.ModularContent,
                elementWrapper: elementWrapper
            });
            this.itemCodenames = elementWrapper.rawElement.value;
            this.value = mappedLinkedItems;
        }
    }
    Elements.LinkedItemsElement = LinkedItemsElement;
    class MultipleChoiceElement extends BaseElement {
        /**
         * Represents multiple choice element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper) {
            super({
                elementType: element_type_1.ElementType.MultipleChoice,
                elementWrapper: elementWrapper
            });
            /**
             * Multiple choice options
             */
            this.value = [];
            if (elementWrapper.rawElement.value && Array.isArray(elementWrapper.rawElement.value)) {
                for (const valueItem of elementWrapper.rawElement.value) {
                    const rawOption = valueItem;
                    if (rawOption && rawOption.name && rawOption.codename) {
                        this.value.push(new element_models_1.ElementModels.MultipleChoiceOption(rawOption.name, rawOption.codename));
                    }
                }
            }
        }
    }
    Elements.MultipleChoiceElement = MultipleChoiceElement;
    class DateTimeElement extends BaseElement {
        /**
         * Represents date time element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper) {
            super({
                elementType: element_type_1.ElementType.DateTime,
                elementWrapper: elementWrapper
            });
            /**
             * Type of the element
             */
            this.type = element_type_1.ElementType.DateTime;
            if (elementWrapper.rawElement.value) {
                this.value = new Date(elementWrapper.rawElement.value);
            }
            else {
                this.value = null;
            }
        }
    }
    Elements.DateTimeElement = DateTimeElement;
    class RichTextElement extends BaseElement {
        /**
         * Represents rich text element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         * @param {string[]} linkedItemCodenames - Array of linked codenames
         */
        constructor(elementWrapper, linkedItemCodenames, data) {
            super({
                elementType: element_type_1.ElementType.RichText,
                elementWrapper: elementWrapper
            });
            /**
             * Type of the element
             */
            this.type = element_type_1.ElementType.RichText;
            this.linkedItemCodenames = linkedItemCodenames;
            this.resolveRichTextFunc = data.resolveRichTextFunc;
            this.links = data.links;
            this.images = data.images;
            this.value = elementWrapper.rawElement.value;
        }
        resolveData() {
            if (this.resolvedData) {
                return this.resolvedData;
            }
            this.resolvedData = this.resolveRichTextFunc();
            return this.resolvedData;
        }
        resolveHtml() {
            if (this.resolvedData) {
                return this.resolvedData.html;
            }
            this.resolvedData = this.resolveRichTextFunc();
            return this.resolvedData.html;
        }
    }
    Elements.RichTextElement = RichTextElement;
    class NumberElement extends BaseElement {
        /**
         * Represents number element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper) {
            super({
                elementType: element_type_1.ElementType.Number,
                elementWrapper: elementWrapper
            });
            if (elementWrapper.rawElement.value === 0) {
                this.value = 0;
            }
            else if (elementWrapper.rawElement.value) {
                this.value = +elementWrapper.rawElement.value;
            }
            else {
                this.value = null;
            }
        }
    }
    Elements.NumberElement = NumberElement;
    class AssetsElement extends BaseElement {
        /**
         * Represents asset element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper) {
            super({
                elementType: element_type_1.ElementType.Asset,
                elementWrapper: elementWrapper
            });
            /**
             * List of assets used in this element
             */
            this.value = [];
            if (elementWrapper.rawElement.value && Array.isArray(elementWrapper.rawElement.value)) {
                const rawAssets = elementWrapper.rawElement.value;
                for (const rawAsset of rawAssets) {
                    this.value.push(new element_models_1.ElementModels.AssetModel(rawAsset));
                }
            }
        }
    }
    Elements.AssetsElement = AssetsElement;
    class UrlSlugElement extends BaseElement {
        /**
         * Represents URL slug element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper, data) {
            super({
                elementType: element_type_1.ElementType.UrlSlug,
                elementWrapper: elementWrapper
            });
            this.value = elementWrapper.rawElement.value;
            this.resolveLinkFunc = data.resolveLinkFunc;
        }
        resolveUrl() {
            if (this.resolvedUrl) {
                return this.resolvedUrl;
            }
            this.resolvedUrl = this.resolveLinkFunc();
            return this.resolvedUrl;
        }
    }
    Elements.UrlSlugElement = UrlSlugElement;
    class TaxonomyElement extends BaseElement {
        /**
         * Represents number element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper) {
            super({
                elementType: element_type_1.ElementType.Taxonomy,
                elementWrapper: elementWrapper
            });
            /**
             * List of assigned taxonomy terms
             */
            this.value = [];
            if (elementWrapper.rawElement.taxonomy_group) {
                this.taxonomyGroup = elementWrapper.rawElement.taxonomy_group;
            }
            else {
                console.warn(`Taxonomy group for element '${elementWrapper.rawElement.name}' is invalid. Assigning empty string`);
                this.taxonomyGroup = '';
            }
            if (elementWrapper.rawElement.value && Array.isArray(elementWrapper.rawElement.value)) {
                const rawTerms = elementWrapper.rawElement.value;
                for (const rawTerm of rawTerms) {
                    this.value.push(new element_models_1.ElementModels.TaxonomyTerm(rawTerm.name, rawTerm.codename));
                }
            }
        }
    }
    Elements.TaxonomyElement = TaxonomyElement;
    class UnknownElement extends BaseElement {
        constructor(elementWrapper) {
            super({
                elementType: element_type_1.ElementType.Unknown,
                elementWrapper: elementWrapper
            });
            this.value = elementWrapper.rawElement.value;
        }
    }
    Elements.UnknownElement = UnknownElement;
    class CustomElement extends BaseElement {
        constructor(elementWrapper) {
            super({
                elementType: element_type_1.ElementType.Custom,
                elementWrapper: elementWrapper
            });
            this.value = elementWrapper.rawElement.value;
        }
    }
    Elements.CustomElement = CustomElement;
    class DefaultCustomElement extends BaseElement {
        /**
         * Represents base custom element
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper) {
            super({
                elementType: element_type_1.ElementType.Custom,
                elementWrapper: elementWrapper
            });
            this.value = elementWrapper.rawElement.value;
        }
    }
    Elements.DefaultCustomElement = DefaultCustomElement;
})(Elements = exports.Elements || (exports.Elements = {}));
//# sourceMappingURL=elements.js.map