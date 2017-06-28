// setup
import { setup, Context, Actor, Movie, MockQueryService, warriorMovieJson } from '../../setup';

// models
import { DeliveryClient, ItemResponses, Fields } from '../../../lib';

// tests
describe('Field types', () => {

    var context = new Context();
    setup(context);

    // mock query service
    var mockQueryService = new MockQueryService(context.getConfig())

    var response: ItemResponses.DeliveryItemResponse<Movie>;

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<Movie>(warriorMovieJson, {});
        done();
    })

  // field types

  it(`check 'TextField' type`, () => {
    expect(response.item.title).toEqual(jasmine.any(Fields.TextField));
  });

  it(`check 'RichTextField' type`, () => {
    expect(response.item.plot).toEqual(jasmine.any(Fields.RichTextField));
  });

  it(`check 'DateTimeField' type`, () => {
    expect(response.item.released).toEqual(jasmine.any(Fields.DateTimeField));
  });

  it(`check 'NumberField' type`, () => {
    expect(response.item.length).toEqual(jasmine.any(Fields.NumberField));
  });

  it(`check 'MultipleChoiceField' type`, () => {
    expect(response.item.category).toEqual(jasmine.any(Fields.MultipleChoiceField));
  });

  it(`check that 'stars' property contains objects of 'Actor' type`, () => {
    expect(response.item.stars[0]).toEqual(jasmine.any(Actor));
  });

   it(`check 'UrlSlugField' type`, () => {
    expect(response.item.seoname).toEqual(jasmine.any(Fields.UrlSlugField));
  });
});

