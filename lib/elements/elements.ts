import { IContentItem, ILink, IRichTextImage } from '../models';
import { ElementModels } from './element-models';

export namespace Elements {
    export type TextElement = ElementModels.IElement<string>;

    export type LinkedItemsElement<TContentItem extends IContentItem = IContentItem> = ElementModels.IElement<
        string[]
    > & {
        /**
         * Linked items
         */
        linkedItems: TContentItem[];
    };

    export type MultipleChoiceElement = ElementModels.IElement<ElementModels.MultipleChoiceOption[]>;

    export type DateTimeElement = ElementModels.IElement<string | null>;

    export type RichTextElement = ElementModels.IElement<string> & {
        /**
         * Links
         */
        links: ILink[];

        /**
         * Images included within rich text element
         */
        images: IRichTextImage[];

        /**
         * Array of linked item codenames
         */
        linkedItemCodenames: string[];
    };

    export type NumberElement = ElementModels.IElement<number | null>;

    export type AssetsElement = ElementModels.IElement<ElementModels.AssetModel[]>;

    export type UrlSlugElement = ElementModels.IElement<string>;

    export type TaxonomyElement = ElementModels.IElement<ElementModels.TaxonomyTerm[]> & {
        /**
         * Taxonomy group
         */
        taxonomyGroup: string | null;
    };

    export type UnknownElement = ElementModels.IElement<any>;

    export type CustomElement<TValue = string> = ElementModels.IElement<TValue>;
}
