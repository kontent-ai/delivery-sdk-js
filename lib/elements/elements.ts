import { IContentItem, Link, RichTextImage } from '../models';
import { ElementModels } from './element-models';

export namespace Elements {
    export interface TextElement extends ElementModels.IElement<string> {}

    export interface LinkedItemsElement<TContentItem extends IContentItem<any> = IContentItem<any>> extends ElementModels.IElement<TContentItem[]> {
        /**
         * Array of linked item codenames
         */
        itemCodenames: string[];

        /**
         * Linked items
         */
        linkedItems: TContentItem[];
    }

    export interface MultipleChoiceElement extends ElementModels.IElement<ElementModels.MultipleChoiceOption[]> {}

    export interface DateTimeElement extends ElementModels.IElement<Date | null> {}

    export interface RichTextElement extends ElementModels.IElement<string> {
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

    export interface NumberElement extends ElementModels.IElement<number | null> {}

    export interface AssetsElement extends ElementModels.IElement<ElementModels.AssetModel[]> {}

    export interface UrlSlugElement extends ElementModels.IElement<string> {}

    export interface TaxonomyElement extends ElementModels.IElement<ElementModels.TaxonomyTerm[]> {
        /**
         * Taxonomy group
         */
        taxonomyGroup?: string;
    }

    export interface UnknownElement extends ElementModels.IElement<any> {}

    export interface CustomElement<TValue = string> extends ElementModels.IElement<TValue> {}
}
