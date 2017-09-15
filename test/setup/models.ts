import { ContentItem, Fields, ILink } from '../../lib';

export class Actor extends ContentItem {
  public firstName: Fields.TextField;
  public lastName: Fields.TextField;
  public photo: Fields.AssetsField;

  constructor() {
    super({
      richTextResolver: (item: Actor) => {
        return `<p>${item.firstName.text}</p>`
      },
      propertyResolver: (fieldName: string) => {
        if (fieldName === 'first_name') {
          return 'firstName'; // binds 'first_name' response from Kentico cloud to 'firstName' property of this class
        }
        if (fieldName === 'last_name') {
          return 'lastName';
        }
      },
      linkResolver: (link: ILink) => {
        return '/actor/' + link.url_slug
      }
    })
  }

  public getFullName(): string {
    return `${this.firstName.text} ${this.lastName.text}`;
  }
}

export class Movie extends ContentItem {
  public title: Fields.TextField;
  public plot: Fields.RichTextField;
  public released: Fields.DateTimeField;
  public length: Fields.NumberField;
  public poster: Fields.AssetsField;
  public category: Fields.MultipleChoiceField;
  public stars: Actor[];
  public seoname: Fields.UrlSlugField;
  public releaseCategory: Fields.TaxonomyField;

  constructor() {
    super({
      propertyResolver: (fieldName) => {
        if (fieldName === 'releasecategory') {
          return 'releaseCategory';
        }
      },
      richTextResolver: (item: Movie) => {
        return `<p>${item.title.text}</p>`
      },
      linkResolver: (link: ILink) => {
        return 'testSlugUrl/' + link.url_slug;
      }
    }, )
  }
}