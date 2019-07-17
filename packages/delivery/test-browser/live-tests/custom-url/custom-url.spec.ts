import { ItemResponses } from '../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Custom URL', () => {

  const itemsUrl: string = 'https://deliver.kenticocloud.com/da5abe9f-fdad-4168-97cd-b3464be2ccb9/items?system.type=movie';

  const context = new Context();
  setup(context);

  let responseItems: ItemResponses.ListContentItemsResponse<Movie>;

  beforeAll((done) => {
    context.deliveryClient.items<Movie>()
      .withUrl(itemsUrl)
      .toObservable()
      .subscribe(r => {
        responseItems = r as ItemResponses.ListContentItemsResponse<Movie>;
        done();
      });
  });

  it(`items should be defined`, () => {
    expect(responseItems).toBeDefined();
  });

  it(`items response should be of proper type`, () => {
    expect(responseItems).toEqual(jasmine.any(ItemResponses.ListContentItemsResponse));
  });

});

