import { BaseItem } from '../../../index';
import { TextField, NumberField, AssetsField } from '../../../index';

export class Author extends BaseItem {
  public name: TextField;
  public image: AssetsField;
}

