import { Link, RichTextImage } from '..';
import { ElementContracts } from '../data-contracts';
import { IContentItem } from '../models';
import { ElementModels } from './element-models';
import { ElementType } from './element-type';
export declare namespace Elements {
    abstract class BaseElement<TValue> implements ElementModels.IElement<TValue> {
        /**
         * Element name
         */
        name: string;
        /**
         * Element type
         */
        type: ElementType;
        /**
         * Raw element value (from JSON response)
         */
        rawData: ElementContracts.IElementContract;
        /**
         * Mapped value of element.
         * For example, value for number elements are converted to number javascript type
         */
        abstract value: TValue;
        constructor(data: {
            elementWrapper: ElementModels.IElementWrapper;
            elementType: ElementType;
        });
    }
    class TextElement extends BaseElement<string> {
        /**
         * Text value
         */
        value: string;
        /**
         * Represents text element of Kentico Kontent item
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper: ElementModels.IElementWrapper);
    }
    class LinkedItemsElement<TItem = IContentItem> extends BaseElement<TItem[]> {
        /**
         * Mapped linked items - contains only those items which are present in 'modular_content' section
         * of the response which depends on the 'depth' of the query request.
         * Codenames of all linked items are stored in 'itemCodenames' property.
         */
        value: TItem[];
        itemCodenames: string[];
        /**
         * Represents text element of Kentico Kontent item
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         * @param {IContentItem} mappedLinkedItems - Array of mapped linked items
         */
        constructor(elementWrapper: ElementModels.IElementWrapper, mappedLinkedItems: TItem[]);
    }
    class MultipleChoiceElement extends BaseElement<ElementModels.MultipleChoiceOption[]> {
        /**
         * Multiple choice options
         */
        value: ElementModels.MultipleChoiceOption[];
        /**
         * Represents multiple choice element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper: ElementModels.IElementWrapper);
    }
    class DateTimeElement extends BaseElement<Date | null> {
        /**
         * Date time value
         */
        value: Date | null;
        /**
         * Type of the element
         */
        type: ElementType;
        /**
         * Represents date time element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper: ElementModels.IElementWrapper);
    }
    class RichTextElement extends BaseElement<string> {
        /**
         * Function that is responsible for getting resolved HTML of the element
         */
        private resolveRichTextFunc;
        /**
         * Resolved rich text element result
         */
        private resolvedData?;
        /**
         * Unresolved html value of rich text element
         */
        value: string;
        /**
         * Type of the element
         */
        type: ElementType;
        /**
         * Links
         */
        links: Link[];
        /**
         * Images included within rich text element
         */
        images: RichTextImage[];
        /**
         * Array of linked item codenames
         */
        linkedItemCodenames: string[];
        /**
         * Represents rich text element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         * @param {string[]} linkedItemCodenames - Array of linked codenames
         */
        constructor(elementWrapper: ElementModels.IElementWrapper, linkedItemCodenames: string[], data: {
            resolveRichTextFunc: () => ElementModels.IRichTextResolverData;
            links: Link[];
            images: RichTextImage[];
        });
        resolveData(): ElementModels.IRichTextResolverData;
        resolveHtml(): string;
    }
    class NumberElement extends BaseElement<number | null> {
        /**
         * Number value of this element
         */
        value: number | null;
        /**
         * Represents number element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper: ElementModels.IElementWrapper);
    }
    class AssetsElement extends BaseElement<ElementModels.AssetModel[]> {
        /**
         * List of assets used in this element
         */
        value: ElementModels.AssetModel[];
        /**
         * Represents asset element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper: ElementModels.IElementWrapper);
    }
    class UrlSlugElement extends BaseElement<string> {
        private resolvedUrl?;
        private resolveLinkFunc;
        value: string;
        /**
         * Represents URL slug element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper: ElementModels.IElementWrapper, data: {
            /**
             * Callback for resolving link
             */
            resolveLinkFunc: () => string;
        });
        resolveUrl(): string;
    }
    class TaxonomyElement extends BaseElement<ElementModels.TaxonomyTerm[]> {
        /**
         * List of assigned taxonomy terms
         */
        value: ElementModels.TaxonomyTerm[];
        /**
         * Taxonomy group
         */
        taxonomyGroup: string;
        /**
         * Represents number element of Kentico Kontent item
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper: ElementModels.IElementWrapper);
    }
    class UnknownElement extends BaseElement<any> {
        value: any;
        constructor(elementWrapper: ElementModels.IElementWrapper);
    }
    abstract class CustomElement extends BaseElement<string | null> {
        value: string | null;
        constructor(elementWrapper: ElementModels.IElementWrapper);
    }
    class DefaultCustomElement extends BaseElement<string | null> {
        /**
         * Resolved value of custom element
         */
        value: string | null;
        /**
         * Represents base custom element
         * @constructor
         * @param {ElementModels.IElementWrapper} elementWrapper - Element data
         */
        constructor(elementWrapper: ElementModels.IElementWrapper);
    }
}
