import { ItemResponses } from '../../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Response with Promises', () => {

  const context = new Context();
  setup(context);

  let response: ItemResponses.ListContentItemsResponse<Movie>;

  beforeAll((done) => {
    context.deliveryClient.items<Movie>()
      .toPromise()
      .then(xResponse => {
        response = xResponse.data;
        done();
      });
  });

  it(`Response items should be retrieved and mapped just like with Promise`, () => {
    expect(response).toEqual(jasmine.any(ItemResponses.ListContentItemsResponse));
  });
});


