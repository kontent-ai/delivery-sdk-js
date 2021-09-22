import { IContentItem, Elements } from '../../../lib';

export type Actor = IContentItem<{
    firstName: Elements.ITextElement;
    lastName: Elements.ITextElement;
    photo: Elements.IAssetsElement;
}>;

export type Movie = IContentItem<{
    title: Elements.ITextElement;
    plot: Elements.IRichTextElement;
    released: Elements.IDateTimeElement;
    length: Elements.INumberElement;
    poster: Elements.IAssetsElement;
    category: Elements.IMultipleChoiceElement;
    stars: Elements.ILinkedItemsElement<Actor>;
    seoname: Elements.IUrlSlugElement;
    releaseCategory: Elements.ITaxonomyElement;
}>;
