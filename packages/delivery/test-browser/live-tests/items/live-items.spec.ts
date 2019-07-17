import { ItemResponses } from '../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Live items', () => {

  const context = new Context();
  setup(context);

  const type: string = 'movie';
  let response: ItemResponses.ListContentItemsResponse<Movie>;

  beforeAll((done) => {
    context.deliveryClient.items<Movie>()
      .type(type)
      .toObservable()
      .subscribe(r => {
        response = r;
        done();
      });
  });

  it(`items should be defined`, () => {
    expect(response).toBeDefined();
  });

  it(`check correct number of items`, () => {
    expect(response.items.length).toEqual(6);
  });

  it(`items should have pagination`, () => {
    expect(response.pagination).toBeDefined();
  });

  it(`'isEmpty' should be false`, () => {
    expect(response.isEmpty).toEqual(false);
  });

  it(`'firstItem' should be correctly assigned`, () => {
    expect(response.items[0].system.codename).toEqual(response.items[0].system.codename);
  });

  it(`'lastItem' should be correctly assigned`, () => {
    if (!response.lastItem) {
      throw Error('invalid last item');
    }
    expect(response.lastItem.system.codename).toEqual(response.items[response.items.length - 1].system.codename);
  });

  it(`debug property should be set for all items`, () => {
    response.items.forEach(item => {
      expect(item._debug).toBeDefined();
      expect(item._debug.rawElements).toBeDefined();
    });
  });

  it(`Linked items should be set`, () => {
    expect(Object.keys(response.linkedItems).length).toBeGreaterThan(0);
  });
});

