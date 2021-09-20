import {
    ContentItem,
    ElementResponses,
    Elements,
    ItemResponses,
    TaxonomyResponses,
    TypeResponses,
    IContentItemElements,
    IContentItem
} from '../../../lib';

export interface IActorElements extends IContentItemElements {
    firstName: Elements.TextElement;
    lastName: Elements.TextElement;
    photo: Elements.AssetsElement;
}

export class Actor extends ContentItem<IActorElements> {
    constructor() {
        super({
            propertyResolver: (elementCodename) => {
                if (elementCodename === 'first_name') {
                    return 'firstName';
                }
                if (elementCodename === 'last_name') {
                    return 'lastName';
                }

                return elementCodename;
            },
            richTextResolver: (item: IContentItem<any>, context) => {
                return `<p>${item.elements.firstName.value}</p>`;
            },
            urlSlugResolver: (link, context) => {
                return {
                    url: '/actor/' + link.urlSlug
                };
            }
        });
    }

    public getFullName(): string {
        return `${this.elements.firstName.value} ${this.elements.lastName.value}`;
    }
}

export interface IMovieElements extends IContentItemElements {
    title: Elements.TextElement;
    plot: Elements.RichTextElement;
    released: Elements.DateTimeElement;
    length: Elements.NumberElement;
    poster: Elements.AssetsElement;
    category: Elements.MultipleChoiceElement;
    stars: Elements.LinkedItemsElement<IActorElements>;
    seoname: Elements.UrlSlugElement;
    releaseCategory: Elements.TaxonomyElement;
}

export class Movie extends ContentItem<IMovieElements> {
    constructor() {
        super({
            propertyResolver: (elementName) => {
                if (elementName === 'releasecategory') {
                    return 'releaseCategory';
                }
                return elementName;
            },
            richTextResolver: (item, context) => {
                return `<p>${item.elements.title.value}</p>`;
            },
            urlSlugResolver: (link, context) => {
                return {
                    url: 'testSlugUrl/' + link.urlSlug
                };
            }
        });
    }
}

export class AllTestObjects {
    // items
    public item!: ItemResponses.ViewContentItemResponse<IMovieElements>;
    public items!: ItemResponses.ListContentItemsResponse<IMovieElements>;

    // taxonomies
    public taxonomy!: TaxonomyResponses.ViewTaxonomyResponse;
    public taxonomies!: TaxonomyResponses.ListTaxonomiesResponse;

    // types
    public type!: TypeResponses.ViewContentTypeResponse;
    public types!: TypeResponses.ListContentTypesResponse;

    // elements
    public element!: ElementResponses.ViewContentTypeElementResponse;

    constructor(data?: {
        // items
        item: ItemResponses.ViewContentItemResponse<IMovieElements>;
        items: ItemResponses.ListContentItemsResponse<IMovieElements>;

        // taxonomies
        taxonomy: TaxonomyResponses.ViewTaxonomyResponse;
        taxonomies: TaxonomyResponses.ListTaxonomiesResponse;

        // types
        type: TypeResponses.ViewContentTypeResponse;
        types: TypeResponses.ListContentTypesResponse;

        // elements
        element: ElementResponses.ViewContentTypeElementResponse;
    }) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
