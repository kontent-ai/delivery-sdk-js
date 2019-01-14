import {
  ContentItem,
  ElementResponses,
  FieldDecorators,
  Fields,
  ItemResponses,
  Link,
  TaxonomyResponses,
  TypeResponses,
} from '../../lib';

export class Actor extends ContentItem {

  @FieldDecorators.codename('first_name')
  public firstName!: Fields.TextField;

  @FieldDecorators.codename('last_name')
  public lastName!: Fields.TextField;

  public photo!: Fields.AssetsField;

  constructor() {
    super({
      richTextResolver: (item, context) => {
        return `<p>${item.firstName.text}</p>`;
      },
      linkResolver: (link: Link) => {
        return '/actor/' + link.urlSlug;
      }
    });
  }

  public getFullName(): string {
    return `${this.firstName.text} ${this.lastName.text}`;
  }
}

export class Movie extends ContentItem {
  public title!: Fields.TextField;
  public plot!: Fields.RichTextField;
  public released!: Fields.DateTimeField;
  public length!: Fields.NumberField;
  public poster!: Fields.AssetsField;
  public category!: Fields.MultipleChoiceField;
  public stars!: Actor[];
  public seoname!: Fields.UrlSlugField;
  public releaseCategory!: Fields.TaxonomyField;

  constructor() {
    super({
      propertyResolver: (fieldName) => {
        if (fieldName === 'releasecategory') {
          return 'releaseCategory';
        }
        return fieldName;
      },
      richTextResolver: (item, context) => {
        return `<p>${item.title.text}</p>`;
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
