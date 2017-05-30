import { BaseItem } from '../../../index';
import { TextField, NumberField, AssetsField } from '../../../index';

export class Category extends BaseItem {
  
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

