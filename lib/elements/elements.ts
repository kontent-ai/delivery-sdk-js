import { IContentItem, Link, RichTextImage } from '../models';
import { ElementModels } from './element-models';

export namespace Elements {
    export interface ITextElement extends ElementModels.IElement<string> {}

    export interface ILinkedItemsElement<TContentItem extends IContentItem<any> = IContentItem<any>> extends ElementModels.IElement<TContentItem[]> {
        /**
         * Array of linked item codenames
         */
        itemCodenames: string[];

        /**
         * Linked items
         */
        linkedItems: TContentItem[];
    }

    export interface IMultipleChoiceElement extends ElementModels.IElement<ElementModels.MultipleChoiceOption[]> {}

    export interface IDateTimeElement extends ElementModels.IElement<Date | null> {}

    export interface IRichTextElement extends ElementModels.IElement<string> {
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
    }

    export interface INumberElement extends ElementModels.IElement<number | null> {}

    export interface IAssetsElement extends ElementModels.IElement<ElementModels.AssetModel[]> {}

    export interface IUrlSlugElement extends ElementModels.IElement<string> {}

    export interface ITaxonomyElement extends ElementModels.IElement<ElementModels.TaxonomyTerm[]> {
        /**
         * Taxonomy group
         */
        taxonomyGroup?: string;
    }

    export interface IUnknownElement extends ElementModels.IElement<any> {}

    export interface ICustomElement<TValue = string> extends ElementModels.IElement<TValue> {}
}
