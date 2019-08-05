import {
  ContentItem,
  ElementDecorators,
  ElementResponses,
  Elements,
  ItemResponses,
  TaxonomyResponses,
  TypeResponses,
} from '../../lib';

export class Actor extends ContentItem {

  @ElementDecorators.codename('first_name')
  public firstName!: Elements.TextElement;

  @ElementDecorators.codename('last_name')
  public lastName!: Elements.TextElement;

  public photo!: Elements.AssetsElement;

  constructor() {
    super({
      richTextResolver: (item: Actor, context) => {
        return `<p>${item.firstName.value}</p>`;
      },
      urlSlugResolver: (link, context) => {
        return {
          url: '/actor/' + link.urlSlug
        };
      }
    });
  }

  public getFullName(): string {
    return `${this.firstName.value} ${this.lastName.value}`;
  }
}

export class Movie extends ContentItem {
  public title!: Elements.TextElement;
  public plot!: Elements.RichTextElement;
  public released!: Elements.DateTimeElement;
  public length!: Elements.NumberElement;
  public poster!: Elements.AssetsElement;
  public category!: Elements.MultipleChoiceElement;
  public stars!: Actor[];
  public seoname!: Elements.UrlSlugElement;
  public releaseCategory!: Elements.TaxonomyElement;

  constructor() {
    super({
      propertyResolver: (elementName) => {
        if (elementName === 'releasecategory') {
          return 'releaseCategory';
        }
        return elementName;
      },
      richTextResolver: (item, context) => {
        return `<p>${item.title.value}</p>`;
      },
      urlSlugResolver: (link, context) => {
        return {
          url: 'testSlugUrl/' + link.urlSlug
        };
      }
    }
    );
  }
}

export class AllTestObjects {

  // items
  public item!: ItemResponses.ViewContentItemResponse<Movie>;
  public items!: ItemResponses.ListContentItemsResponse<Movie>;

  // taxonomies
  public taxonomy!: TaxonomyResponses.ViewTaxonomyGroupResponse;
  public taxonomies!: TaxonomyResponses.ListTaxonomyGroupsResponse;

  // types
  public type!: TypeResponses.ViewContentTypeResponse;
  public types!: TypeResponses.ListContentTypesResponse;

  // elements
  public element!: ElementResponses.ViewContentTypeElementResponse;

  constructor(data?: {
    // items
    item: ItemResponses.ViewContentItemResponse<Movie>,
    items: ItemResponses.ListContentItemsResponse<Movie>,

    // taxonomies
    taxonomy: TaxonomyResponses.ViewTaxonomyGroupResponse,
    taxonomies: TaxonomyResponses.ListTaxonomyGroupsResponse,

    // types
    type: TypeResponses.ViewContentTypeResponse,
    types: TypeResponses.ListContentTypesResponse,

    // elements
    element: ElementResponses.ViewContentTypeElementResponse

  }) { if (data) { Object.assign(this, data); } }
}
