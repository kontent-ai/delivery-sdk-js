import { retryService } from '@kentico/kontent-core';

import { Context } from '../../setup/context';
import { setup } from '../../setup/setup';

describe('Retry Promise - isolated - retry', () => {
    const retryAttempts = 2;
    const MAX_SAFE_TIMEOUT = Math.pow(2, 31) - 1;

    const context = new Context();
    context.retryStrategy = {
        canRetryError: (error) => true,
        maxAttempts: 2,
        addJitter: false,
        deltaBackoffMs: 1000,
        maxCumulativeWaitTimeMs: 5000,
    };

    setup(context);
    const client = context.deliveryClient;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = MAX_SAFE_TIMEOUT;

    beforeAll((done) => {
        spyOn(retryService, 'debugLogAttempt').and.callThrough();

        const promise = client.item('xxxyyyy').toPromise(); // throws 404 which we retry

        promise.then((response) => {
            throw Error(`This call should not succeed`);
        }).catch(err => {
            done();
        });

    });

    it(`Warning for retry attempt should have been called '${retryAttempts}'`, () => {
        expect(retryService.debugLogAttempt).toHaveBeenCalledTimes(retryAttempts);
    });
});

