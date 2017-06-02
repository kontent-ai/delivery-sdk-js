import { ContentItem, TextField } from '../../../index';

export class DeeperCategory extends ContentItem {
  
  public deepCategory: TextField;

  constructor() {
    super({
      resolver: (fieldName: string) => {
        if (fieldName === 'deepcategory') {
          return 'deepCategory';
        }
      }
    })
  }
}

