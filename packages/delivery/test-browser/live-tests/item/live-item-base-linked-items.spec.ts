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
      .getObservable()
      .subscribe(r => {
        response = r as ItemResponses.DeliveryItemResponse<Movie>;
        done();
      });
  });

  it(`verify linked items included in response and are of 'ContentItem' type`, () => {
    expect(response.linkedItems.length).toEqual(3);

    response.linkedItems.forEach(processedItem => {
      expect(processedItem).toEqual(jasmine.any(ContentItem));
    });
  });

});

