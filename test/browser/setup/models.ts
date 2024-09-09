import { Elements, IContentItem } from '../../../lib';

export type Actor = IContentItem<{
    first_name: Elements.TextElement;
    last_name: Elements.TextElement;
    photo: Elements.AssetsElement;
}>;

export type releasecategoryTaxonomy = 'global_release' | 'us_only' | 'local_release';

export type Movie = IContentItem<{
    title: Elements.TextElement;
    plot: Elements.RichTextElement;
    released: Elements.DateTimeElement;
    length: Elements.NumberElement;
    poster: Elements.AssetsElement;
    category: Elements.MultipleChoiceElement;
    stars: Elements.LinkedItemsElement<Actor>;
    seoname: Elements.UrlSlugElement;
    releasecategory: Elements.TaxonomyElement<releasecategoryTaxonomy>;
}>;
