import { IContentItem, ContentItem, TextField, NumberField, AssetsField, MultipleChoiceField, UrlSlugField } from '../../../lib';

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
      urlSlugResolver: (contentItem, urlSlug) =>{
        return 'someurl/' + urlSlug;
      },
      richTextResolver: (contentItem: CodeExample) => {
            return `Resolver modular content in rich text: <h2>'${contentItem.title.text}'</h2>`;
        }
    })
  }
}
