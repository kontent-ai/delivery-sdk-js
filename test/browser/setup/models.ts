import { Elements, IContentItem } from '../../../lib';

type LanguageCodenames = 'default' | 'en';
type CollectionCodenames = 'default';
type WorkflowCodenames = 'default';
type WorkflowStepCodenames = 'draft' | 'published' | 'review';
type ActorElementCodenames = 'first_name' | 'last_name' | 'photo';

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
    WorkflowStepCodenames,
    ActorElementCodenames
>;

export type ReleaseCategoryTaxonomy = 'global_release' | 'us_only' | 'local_release';
export type CategoryMultipleChoiceOptionCodenames = 'sci_fi' | 'action' | 'comedy' | 'drama' | 'romance' | 'animation';

type MovieElementCodenames =
    | 'title'
    | 'plot'
    | 'released'
    | 'length'
    | 'poster'
    | 'category'
    | 'stars'
    | 'seoname'
    | 'releasecategory';

export type Movie = IContentItem<
    {
        readonly title: Elements.TextElement;
        readonly plot: Elements.RichTextElement;
        readonly released: Elements.DateTimeElement;
        readonly length: Elements.NumberElement;
        readonly category: Elements.MultipleChoiceElement<CategoryMultipleChoiceOptionCodenames>;
        readonly seoname: Elements.UrlSlugElement;
        readonly poster: Elements.AssetsElement;
        readonly stars: Elements.LinkedItemsElement<Actor>;
        readonly releasecategory: Elements.TaxonomyElement<ReleaseCategoryTaxonomy, 'releasecategory'>;
    },
    'movie',
    LanguageCodenames,
    CollectionCodenames,
    WorkflowCodenames,
    WorkflowStepCodenames,
    MovieElementCodenames
>;
