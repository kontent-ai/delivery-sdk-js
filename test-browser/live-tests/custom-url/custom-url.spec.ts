import { ItemResponses } from '../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Custom URL', () => {

  const itemsUrl: string = 'https://deliver.kenticocloud.com/da5abe9f-fdad-4168-97cd-b3464be2ccb9/items?system.type=movie';

  const context = new Context();
  setup(context);

  const type: string = 'movie';
  let responseItems: ItemResponses.DeliveryItemListingResponse<Movie>;

  beforeAll((done) => {
    context.deliveryClient.items<Movie>()
      .withUrl(itemsUrl)
      .getObservable()
      .subscribe(r => {
        responseItems = r as ItemResponses.DeliveryItemListingResponse<Movie>;
        done();
      });
  });

  it(`items should be defined`, () => {
    expect(responseItems).toBeDefined();
  });

  it(`items response should be of proper type`, () => {
    expect(responseItems).toEqual(jasmine.any(ItemResponses.DeliveryItemListingResponse));
  });

});

