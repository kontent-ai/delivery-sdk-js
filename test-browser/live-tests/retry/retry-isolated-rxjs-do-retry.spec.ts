import { retryService } from '@kentico/kontent-core';

import { Context, setup } from '../../setup';

describe('Retry rxjs - isolated - retry', () => {
    const retryAttempts = 2;
    const MAX_SAFE_TIMEOUT = Math.pow(2, 31) - 1;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = MAX_SAFE_TIMEOUT;

    beforeAll((done) => {
        spyOn(retryService, 'debugLogAttempt').and.callThrough();

        const context = new Context();
        context.retryStrategy = {
            maxAttempts: retryAttempts,
            addJitter: false,
            deltaBackoffMs: 1000,
            maxCumulativeWaitTimeMs: 5000,
            canRetryError: (error) => true
        };

        setup(context);
        const client = context.deliveryClient;

        const observable = client.item('xxxyyy').toObservable(); // throws 404 which we retry

        observable.subscribe(
            response => {
                throw Error(`This call should not succeed`);
            },
            error => {
                console.warn(error);
                done();
            }
        );

    });

    it(`Warning for retry attempt should have been called '${retryAttempts}'`, () => {
        expect(retryService.debugLogAttempt).toHaveBeenCalledTimes(retryAttempts);
    });
});

