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

    export type MultipleChoiceElement<TOptionCodenames extends string = string> = ElementModels.IElement<
        ElementModels.MultipleChoiceOption<TOptionCodenames>[]
    >;

    export type DateTimeElement = ElementModels.IElement<string | null> & {
        /**
         * Display time zone
         */
        displayTimeZone: string | null;
    };

    export type RichTextElement<TContentItem extends IContentItem = IContentItem> = ElementModels.IElement<string> & {
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

        /**
         * Array of linked items retrieved from `modular_content` part of the response. Not all items might be here
         * as it depends on the `depth` parameter of query.
         * The `linkedItemsReferenceHandler` configuration can be used to disable mapping of linked items
         */
        linkedItems: TContentItem[];
    };

    export type NumberElement = ElementModels.IElement<number | null>;

    export type AssetsElement = ElementModels.IElement<ElementModels.AssetModel[]>;

    export type UrlSlugElement = ElementModels.IElement<string>;

    export type TaxonomyElement<
        TaxonomyCodenames extends string = string,
        TaxonomyGroupCodename extends string = string
    > = ElementModels.IElement<ElementModels.TaxonomyTerm<TaxonomyCodenames>[]> & {
        /**
         * Taxonomy group
         */
        taxonomyGroup: TaxonomyGroupCodename;
    };

    export type UnknownElement = ElementModels.IElement<any>;

    export type CustomElement<TValue = string> = ElementModels.IElement<TValue>;
}
