import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ContentItem } from '../../../../lib';
import { Context, setup } from '../../setup';

describe('Unsubscriptions', () => {
  const context = new Context();
  setup(context);

  let subscription: Subscription | undefined = undefined;
  let finalizeCalled: boolean = false;

  beforeAll(done => {
    subscription = context.deliveryClient
      .items<ContentItem>()
      .toObservable()
      .pipe(
        finalize(() => {
          finalizeCalled = true;
        })
      )
      .subscribe(r => {
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
