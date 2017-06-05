import { ContentItem, TextField, NumberField, AssetsField, MultipleChoiceField, UrlSlugField } from '../../../index';

// nested type models
import { Author } from './author.class';
import { Category } from './category.class';

export class CodeExample extends ContentItem {

  public title: TextField;
  public author: Author[];
  public category: Category[];
  public versions: MultipleChoiceField;
  public codeExampleUrlSlug: UrlSlugField;

  constructor() {
    super({
      resolver: (fieldName: string) => {
        if (fieldName === 'codeexampleurlslug') {
          return 'codeExampleUrlSlug';
        }
      },
      urlSlugResolver: (fieldName: string, value: string) => {
        if (fieldName === 'codeexampleurlslug'){
          return `/actors/${value}`;
        }
      }
    })
  }
}

