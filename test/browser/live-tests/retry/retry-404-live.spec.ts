import { retryService } from '@kentico/kontent-core';

import { Context, setup } from '../../setup';

describe('Live 404 retry', () => {
    const retryAttempts = 1;

    const context = new Context();
    context.retryStrategy = {
        maxAttempts: retryAttempts,
        addJitter: false,
        deltaBackoffMs: 0,
        maxCumulativeWaitTimeMs: 5000,
        canRetryError: (error) => true
    };

    setup(context);

    const MAX_SAFE_TIMEOUT = Math.pow(2, 31) - 1;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = MAX_SAFE_TIMEOUT;

    beforeAll((done) => {
        // this will fail
        spyOn(retryService, 'debugLogAttempt').and.callThrough();
        context.deliveryClient.items().withUrl('https://deliver.kenticocloud.com/da5abe9f-fdad-4168-97cd-b3464be2ccb9/items/invalid-url')
            .toObservable()
            .subscribe(response => {
            }, err => {
                done();
            });
    });

    it(`Warning for retry attempt should have been called '${retryAttempts}' times`, () => {
        expect(retryService.debugLogAttempt).toHaveBeenCalledTimes(retryAttempts);
    });
});

