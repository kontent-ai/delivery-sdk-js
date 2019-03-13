import { retryService } from 'kentico-cloud-core';

import { Context } from '../../setup/context';
import { setup } from '../../setup/setup';

describe('Retry Promise - isolated - retry', () => {
    const retryAttempts = 3;
    const MAX_SAFE_TIMEOUT = Math.pow(2, 31) - 1;

    const context = new Context();
    context.retryStatusCodes = [0];
    setup(context);
    const client = context.deliveryClient;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = MAX_SAFE_TIMEOUT;

    beforeAll((done) => {
        spyOn(retryService, 'debugLogAttempt').and.callThrough();

        const promise = client.items().withUrl('fakeUrl').toPromise();

        promise.then((response) => {
            throw Error(`This call should not succeed`);
        }).catch(err => {
            console.log(err);
            done();
        });

    });

    it(`Warning for retry attempt should have been called '${retryAttempts}'`, () => {
        expect(retryService.debugLogAttempt).toHaveBeenCalledTimes(retryAttempts);
    });
});

