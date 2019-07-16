import {
  ContentItem,
  ElementResponses,
  ElementDecorators,
  Elements,
  ItemResponses,
  Link,
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
      linkResolver: (link: Link) => {
        return '/actor/' + link.urlSlug;
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
      linkResolver: (link: Link) => {
        return 'testSlugUrl/' + link.urlSlug;
      }
    }
    );
  }
}

export class AllTestObjects {

  // items
  public item!: ItemResponses.DeliveryItemResponse<Movie>;
  public items!: ItemResponses.DeliveryItemListingResponse<Movie>;

  // taxonomies
  public taxonomy!: TaxonomyResponses.TaxonomyResponse;
  public taxonomies!: TaxonomyResponses.TaxonomiesResponse;

  // types
  public type!: TypeResponses.DeliveryTypeResponse;
  public types!: TypeResponses.DeliveryTypeListingResponse;

  // elements
  public element!: ElementResponses.ElementResponse;

  constructor(data?: {
    // items
    item: ItemResponses.DeliveryItemResponse<Movie>,
    items: ItemResponses.DeliveryItemListingResponse<Movie>,

    // taxonomies
    taxonomy: TaxonomyResponses.TaxonomyResponse,
    taxonomies: TaxonomyResponses.TaxonomiesResponse,

    // types
    type: TypeResponses.DeliveryTypeResponse,
    types: TypeResponses.DeliveryTypeListingResponse,

    // elements
    element: ElementResponses.ElementResponse

  }) { if (data) { Object.assign(this, data); } }
}
