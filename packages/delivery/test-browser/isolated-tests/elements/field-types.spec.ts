import { Elements, ItemResponses, sdkInfo } from '../../../lib';
import { Actor, Context, MockQueryService, Movie, setup, warriorMovieJson } from '../../setup';
import { HttpService } from '@kentico/kontent-core';

describe('Element types', () => {

  const context = new Context();
  setup(context);

  const mockQueryService = new MockQueryService(context.getConfig(), new HttpService(), {
    host: sdkInfo.host,
    name: sdkInfo.name,
    version: sdkInfo.version
  });

  let response: ItemResponses.ViewContentItemResponse<Movie>;

  beforeAll((done) => {
    response = mockQueryService.mockGetSingleItem<Movie>(warriorMovieJson, {});
    done();
  });

  it(`check 'TextElement' type`, () => {
    expect(response.item.title).toEqual(jasmine.any(Elements.TextElement));
  });

  it(`check 'RichTextElement' type`, () => {
    expect(response.item.plot).toEqual(jasmine.any(Elements.RichTextElement));
  });

  it(`check 'DateTimeElement' type`, () => {
    expect(response.item.released).toEqual(jasmine.any(Elements.DateTimeElement));
  });

  it(`check 'NumberElement' type`, () => {
    expect(response.item.length).toEqual(jasmine.any(Elements.NumberElement));
  });

  it(`check 'MultipleChoiceElement' type`, () => {
    expect(response.item.category).toEqual(jasmine.any(Elements.MultipleChoiceElement));
  });

  it(`check that 'stars' property contains objects of 'Actor' type`, () => {
    expect(response.item.stars.value[0]).toEqual(jasmine.any(Actor));
  });

  it(`check 'UrlSlugElement' type`, () => {
    expect(response.item.seoname).toEqual(jasmine.any(Elements.UrlSlugElement));
  });
});

