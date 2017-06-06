import { ContentItem, TextField } from '../../../lib';
import { DeeperCategory} from './deeper-category';

export class Category extends ContentItem {
  
  public categoryName: TextField;
  public deeperCategory: DeeperCategory[];

  constructor() {
    super({
      resolver: (fieldName: string) => {
        if (fieldName === 'category_name') {
          return 'categoryName';
        }
        if (fieldName === 'deepercategory') {
          return 'deeperCategory';
        }
      }
    })
  }
}

