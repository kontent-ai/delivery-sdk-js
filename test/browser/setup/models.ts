import { Elements, IContentItem } from '../../../lib';

type LanguageCodenames = 'default' | 'en';
type CollectionCodenames = 'default';
type WorkflowCodenames = 'default';
type WorkflowStepCodenames = 'draft' | 'published' | 'review';

export type Actor = IContentItem<
    {
        readonly first_name: Elements.TextElement;
        readonly last_name: Elements.TextElement;
        readonly photo: Elements.AssetsElement;
    },
    'actor',
    LanguageCodenames,
    CollectionCodenames,
    WorkflowCodenames,
    WorkflowStepCodenames
>;

export type ReleaseCategoryTaxonomy = 'global_release' | 'us_only' | 'local_release';
export type CategoryMultipleChoiceOptionCodenames = 'sci_fi' | 'action' | 'comedy' | 'drama' | 'romance' | 'animation';

export type Movie = IContentItem<
    {
        readonly title: Elements.TextElement;
        readonly plot: Elements.RichTextElement;
        readonly released: Elements.DateTimeElement;
        readonly length: Elements.NumberElement;
        readonly poster: Elements.AssetsElement;
        readonly category: Elements.MultipleChoiceElement<CategoryMultipleChoiceOptionCodenames>;
        readonly stars: Elements.LinkedItemsElement<Actor>;
        readonly seoname: Elements.UrlSlugElement;
        readonly releasecategory: Elements.TaxonomyElement<ReleaseCategoryTaxonomy, 'releasecategory'>;
    },
    'movie',
    LanguageCodenames,
    CollectionCodenames,
    WorkflowCodenames,
    WorkflowStepCodenames
>;
