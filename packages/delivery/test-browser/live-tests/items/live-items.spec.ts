import { ItemResponses } from '../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Live items', () => {

  const context = new Context();
  setup(context);

  const type: string = 'movie';
  let response: ItemResponses.DeliveryItemListingResponse<Movie>;

  beforeAll((done) => {
    context.deliveryClient.items<Movie>()
      .type(type)
      .getObservable()
      .subscribe(r => {
        response = r as ItemResponses.DeliveryItemListingResponse<Movie>;
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

  it(`elements property should be set for all items`, () => {
    response.items.forEach(item => {
      expect(item.elements).toBeDefined();
      expect(item.elements.title.value).toEqual(item.title.text);
    });
  });

  it(`Linked items should be set`, () => {
    expect(response.linkedItems.length).toBeGreaterThan(0);
  });
});

