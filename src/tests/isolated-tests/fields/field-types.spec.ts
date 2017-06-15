// setup
import { setup, Context, Actor, Movie, MockQueryService, warriorMovieJson } from '../../setup';

// models
import {
  DeliveryClient, DeliveryItemResponse, AssetsField, DateTimeField,
  MultipleChoiceField, NumberField, RichTextField, TextField, UrlSlugField
} from '../../../../lib';

// tests
describe('Field types', () => {

    var context = new Context();
    setup(context);

    // mock query service
    var mockQueryService = new MockQueryService(context.getConfig())

    var response: DeliveryItemResponse<Movie>;

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<Movie>(warriorMovieJson, {});
        done();
    })

  // field types

  it(`check 'TextField' type`, () => {
    expect(response.item.title).toEqual(jasmine.any(TextField));
  });

  it(`check 'RichTextField' type`, () => {
    expect(response.item.plot).toEqual(jasmine.any(RichTextField));
  });

  it(`check 'DateTimeField' type`, () => {
    expect(response.item.released).toEqual(jasmine.any(DateTimeField));
  });

  it(`check 'NumberField' type`, () => {
    expect(response.item.length).toEqual(jasmine.any(NumberField));
  });

  it(`check 'MultipleChoiceField' type`, () => {
    expect(response.item.category).toEqual(jasmine.any(MultipleChoiceField));
  });

  it(`check that 'stars' property contains objects of 'Actor' type`, () => {
    expect(response.item.stars[0]).toEqual(jasmine.any(Actor));
  });

   it(`check 'UrlSlugField' type`, () => {
    expect(response.item.seoname).toEqual(jasmine.any(UrlSlugField));
  });
});

