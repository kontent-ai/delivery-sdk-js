import { deliveryRetryStrategy } from '../../../lib';
import { Context, setup } from '../../setup';

describe('Live 404 retry', () => {
    const context = new Context();

    const retryAttempts = 3;

    // set retry attempts
    context.retryAttempts = retryAttempts;

    // set fake base url because we want this to fail
    context.baseUrl = 'http://fakeurl';

    setup(context);

    const MAX_SAFE_TIMEOUT = Math.pow(2, 31) - 1;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = MAX_SAFE_TIMEOUT;

    beforeAll((done) => {
        // this will fail
        spyOn(deliveryRetryStrategy, 'debugLogAttempt').and.callThrough();
        context.deliveryClient.items()
            .getObservable()
            .subscribe(response => {
            }, err => {
                done();
            });
    });

    it(`Warning for retry attempt should have been called '0' times because 404 response codes should not be retried`, () => {
        expect(deliveryRetryStrategy.debugLogAttempt).toHaveBeenCalledTimes(0);
    });
});

