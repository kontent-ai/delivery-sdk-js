import {
  ContentItem, TextField, NumberField, DateTimeField,
  RichTextField, AssetsField, MultipleChoiceField, UrlSlugField
} from '../../../lib';

import { Actor } from './actor.class';

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
      urlSlugResolver: (item, urlSlug) => {
        return 'testslug/' + urlSlug;
      }
    })
  }
}