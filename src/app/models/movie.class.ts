import {
  ContentItem, Fields
} from '../../../lib';

import { Actor } from './actor.class';

export class Movie extends ContentItem {
  public title: Fields.TextField;
  public plot: Fields.RichTextField;
  public released: Fields.DateTimeField;
  public length: Fields.NumberField;
  public poster: Fields.AssetsField;
  public category: Fields.MultipleChoiceField;
  public stars: Actor[];
  public releaseCategory: Fields.TaxonomyField;

  constructor() {
    super({
      propertyResolver: (fieldName) => {
        if (fieldName === 'releasecategory') {
          return 'releaseCategory';
        }
      }
    })
  }

  getCategoriesText(): string {
    if (!this.category) {
      return null;
    }

    return this.category.options.map(m => m.name.toLocaleLowerCase()).join(', ');
  }

  getStarsText(): string {
    if (!this.stars) {
      return null;
    }
    return this.stars.map(actor => actor.getFullName()).join(', ');
  }
}