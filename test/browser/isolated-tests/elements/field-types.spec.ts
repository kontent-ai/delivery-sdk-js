import { Elements, ItemResponses, sdkInfo } from '../../../../lib';
import { Actor, Context, IMovieElements, MockQueryService, setup } from '../../setup';
import { HttpService } from '@kentico/kontent-core';
import * as warriorJson from '../fake-data/fake-warrior-response.json';

describe('Element types', () => {

  const context = new Context();
  setup(context);

  const mockQueryService = new MockQueryService(context.getConfig(), new HttpService(), {
    host: sdkInfo.host,
    name: sdkInfo.name,
    version: sdkInfo.version
  });

  let response: ItemResponses.ViewContentItemResponse<IMovieElements>;

  beforeAll((done) => {
    response = mockQueryService.mockGetSingleItem<IMovieElements>(warriorJson, {});
    done();
  });

  it(`check 'TextElement' type`, () => {
    expect(response.item.elements.title).toEqual(jasmine.any(Elements.TextElement));
  });

  it(`check 'RichTextElement' type`, () => {
    expect(response.item.elements.plot).toEqual(jasmine.any(Elements.RichTextElement));
  });

  it(`check 'DateTimeElement' type`, () => {
    expect(response.item.elements.released).toEqual(jasmine.any(Elements.DateTimeElement));
  });

  it(`check 'NumberElement' type`, () => {
    expect(response.item.elements.length).toEqual(jasmine.any(Elements.NumberElement));
  });

  it(`check 'MultipleChoiceElement' type`, () => {
    expect(response.item.elements.category).toEqual(jasmine.any(Elements.MultipleChoiceElement));
  });

  it(`check that 'stars' property contains objects of 'Actor' type`, () => {
    expect(response.item.elements.stars.value[0]).toEqual(jasmine.any(Actor));
  });

  it(`check 'UrlSlugElement' type`, () => {
    expect(response.item.elements.seoname).toEqual(jasmine.any(Elements.UrlSlugElement));
  });
});

