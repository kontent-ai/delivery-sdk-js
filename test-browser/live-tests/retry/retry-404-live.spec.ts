import { retryService } from '@kentico/kontent-core';

import { Context, setup } from '../../setup';

describe('Live 404 retry', () => {
    const context = new Context();
    context.retryStrategy = {
        addJitter: false,
        deltaBackoffMs: 1000,
        maxCumulativeWaitTimeMs: 5000,
        useRetryForResponseCodes: []
    };

    // set fake base url because we want this to fail
    context.baseUrl = 'http://fakeurl';

    setup(context);

    const MAX_SAFE_TIMEOUT = Math.pow(2, 31) - 1;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = MAX_SAFE_TIMEOUT;

    beforeAll((done) => {
        // this will fail
        spyOn(retryService, 'debugLogAttempt').and.callThrough();
        context.deliveryClient.items()
            .toObservable()
            .subscribe(response => {
            }, err => {
                done();
            });
    });

    it(`Warning for retry attempt should have been called '0' times because 404 response codes should not be retried`, () => {
        expect(retryService.debugLogAttempt).toHaveBeenCalledTimes(0);
    });
});

