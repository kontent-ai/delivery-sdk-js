// setup
import { setup, Context, Actor, Movie } from '../setup';

// models
import {
  DeliveryClient, DeliveryItemResponse, AssetsField, DateTimeField,
  MultipleChoiceField, NumberField, RichTextField, TextField, UrlSlugField
} from '../../../lib';

// tests
describe('Field type', () => {

  var context = new Context();
  setup(context);

  var movieCodename: string = 'warrior';
  var movieResponse: DeliveryItemResponse<Movie>;

  beforeAll((done) => {

    context.deliveryClient.item<Movie>(movieCodename)
      .get()
      .subscribe(response => {
        movieResponse = response as DeliveryItemResponse<Movie>;
        done();
      });
  });

  // field types

  it(`check 'TextField' type`, () => {
    expect(movieResponse.item.title).toEqual(jasmine.any(TextField));
  });

  it(`check 'RichTextField' type`, () => {
    expect(movieResponse.item.plot).toEqual(jasmine.any(RichTextField));
  });

  it(`check 'DateTimeField' type`, () => {
    expect(movieResponse.item.released).toEqual(jasmine.any(DateTimeField));
  });

  it(`check 'NumberField' type`, () => {
    expect(movieResponse.item.length).toEqual(jasmine.any(NumberField));
  });

  it(`check 'MultipleChoiceField' type`, () => {
    expect(movieResponse.item.category).toEqual(jasmine.any(MultipleChoiceField));
  });

  it(`check that 'stars' property contains objects of 'Actor' type`, () => {
    expect(movieResponse.item.stars[0]).toEqual(jasmine.any(Actor));
  });

   it(`check 'UrlSlugField' type`, () => {
    expect(movieResponse.item.seoname).toEqual(jasmine.any(UrlSlugField));
  });
});

