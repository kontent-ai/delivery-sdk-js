import {
  ContentItem, TextField, NumberField, DateTimeField,
  RichTextField, AssetsField, MultipleChoiceField, UrlSlugField
} from '../../../lib';


export class Actor extends ContentItem {
  public firstName: TextField;
  public lastName: TextField;
  public photo: AssetsField;

  constructor() {
    super({
      richTextResolver: (item: Actor) => {
        return `<p>${item.firstName.text}</p>`
      },
      resolver: (fieldName: string) => {
        if (fieldName === 'first_name') {
          return 'firstName'; // binds 'first_name' response from Kentico cloud to 'firstName' property of this class
        }
        if (fieldName === 'last_name') {
          return 'lastName';
        }
      }
    })
  }

  public getFullName(): string {
    return `${this.firstName.text} ${this.lastName.text}`;
  }
}

export class Movie extends ContentItem {
  public title: TextField;
  public plot: RichTextField;
  public released: DateTimeField;
  public length: NumberField;
  public poster: AssetsField;
  public category: MultipleChoiceField;
  public stars: Actor[];
  public seoname: UrlSlugField;

  constructor(){
    super({
      richTextResolver: (item: Movie) => {
        return `<p>${item.title.text}</p>`
      },
      urlSlugResolver: (item, urlSlug) => {
        return 'testSlugUrl/' + urlSlug;
      }
    },)
  }
}