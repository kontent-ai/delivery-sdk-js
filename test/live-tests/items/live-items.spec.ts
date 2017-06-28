// setup
import { setup, Context, Actor, Movie } from '../../setup';

// models
import { ItemResponses, FieldModels } from '../../../lib';

// tests
describe('Live items', () => {

  var context = new Context();
  setup(context);

  var type: string = 'movie';
  var response: ItemResponses.DeliveryItemListingResponse<Movie>;

  beforeAll((done) => {
    context.deliveryClient.items<Movie>()
      .type(type)
      .get()
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

  it(`'isEmpty' should be false`, () => {
    expect(response.isEmpty).toEqual(false);
  });

  it(`'firstItem' should be correctly assigned`, () => {
    expect(response.firstItem.system.codename).toEqual(response.items[0].system.codename);
  });

  it(`'lastItem' should be correctly assigned`, () => {
    expect(response.lastItem.system.codename).toEqual(response.items[response.items.length - 1].system.codename);
  });
});

