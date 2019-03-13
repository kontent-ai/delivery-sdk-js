import { ContentItem, ItemResponses } from '../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Live item - base linked items', () => {

  const context = new Context();
  context.typeResolvers = [];
  setup(context);

  const movieCodename: string = 'warrior';
  let response: ItemResponses.DeliveryItemResponse<Movie>;

  beforeAll((done) => {
    context.deliveryClient.item(movieCodename)
      .toObservable()
      .subscribe(r => {
        response = r as ItemResponses.DeliveryItemResponse<Movie>;
        done();
      });
  });

  it(`verify linked items included in response and are of 'ContentItem' type`, () => {
    expect(Object.keys(response.linkedItems).length).toEqual(3);

    for (const key of Object.keys(response.linkedItems)) {
      const linkedItem = response.linkedItems[key];
      expect(linkedItem).toEqual(jasmine.any(ContentItem));

    }
  });

});

