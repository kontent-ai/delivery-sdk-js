import { retryStrategy } from '../../lib';
import { createTestClient } from '../client-factory';

describe('Retry', () => {
    const retryAttempts = 3;

    const trackingClient = createTestClient();
    // set retry attempts
    const config = createTestClient().getConfig();
    config.retryAttempts = retryAttempts;

    // set fake base url because we want this to fail
    config.baseUrl = 'http://fakeurl';

    const MAX_SAFE_TIMEOUT = Math.pow(2, 31) - 1;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = MAX_SAFE_TIMEOUT;

    beforeAll((done) => {
        // this will fail
        spyOn(retryStrategy, 'debugLogAttempt').and.callThrough();
        trackingClient.recordNewSession({ uid: '1', sid: '1' })
            .getObservable()
            .subscribe(response => {
            }, err => {
                done();
            });
    });

    it(`Warning for retry attempt should have been called '${retryAttempts}' times`, () => {
        expect(retryStrategy.debugLogAttempt).toHaveBeenCalledTimes(retryAttempts);
    });
});

