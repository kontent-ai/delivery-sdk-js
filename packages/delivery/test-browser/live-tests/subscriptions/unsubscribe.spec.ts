import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ContentItem, ItemResponses } from '../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Unsubscriptions', () => {
  const context = new Context();
  setup(context);

  let subscription: Subscription | undefined = undefined;
  let finalizeCalled: boolean = false;
  let response: ItemResponses.DeliveryItemListingResponse<ContentItem>;

  beforeAll(done => {
    subscription = context.deliveryClient
      .items<ContentItem>()
      .getObservable()
      .pipe(
        finalize(() => {
          finalizeCalled = true;
        })
      )
      .subscribe(r => {
        response = r as ItemResponses.DeliveryItemListingResponse<Movie>;
        done();
      });
  });

  it(`Subscription should be closed`, () => {
    if (subscription) {
      expect(subscription.closed).toEqual(true);
    } else {
      throw Error(`Invalid subscription`);
    }
  });

  it(`Finalize callback should be called`, () => {
    expect(finalizeCalled).toEqual(true);
  });
});
