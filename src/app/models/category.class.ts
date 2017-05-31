import { ContentItem, TextField } from '../../../index';

export class Category extends ContentItem {
  
  public categoryName: TextField;

  constructor() {
    super({
      resolver: (fieldName: string) => {
        if (fieldName === 'category_name') {
          return 'categoryName';
        }
      }
    })
  }
}

