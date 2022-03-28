import { IContentItem, Elements } from '../../../lib';

export type Actor = IContentItem<{
    firstName: Elements.TextElement;
    lastName: Elements.TextElement;
    photo: Elements.AssetsElement;
}>;

export type ReleaseCategoryTaxonomy = 'global_release' | 'us_only' | 'local_release';

export type Movie = IContentItem<{
    title: Elements.TextElement;
    plot: Elements.RichTextElement;
    released: Elements.DateTimeElement;
    length: Elements.NumberElement;
    poster: Elements.AssetsElement;
    category: Elements.MultipleChoiceElement;
    stars: Elements.LinkedItemsElement<Actor>;
    seoname: Elements.UrlSlugElement;
    releaseCategory: Elements.TaxonomyElement<ReleaseCategoryTaxonomy>;
}>;
