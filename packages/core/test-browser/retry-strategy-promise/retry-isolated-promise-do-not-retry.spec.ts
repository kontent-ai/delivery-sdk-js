import { HttpService, retryService } from '../../lib';

describe('Retry Promise - isolated do not retry', () => {
    const retryAttempts = 3;
    const useRetryForResponseCodes: number[] = [500];

    const MAX_SAFE_TIMEOUT = Math.pow(2, 31) - 1;
    const httpService = new HttpService();

    jasmine.DEFAULT_TIMEOUT_INTERVAL = MAX_SAFE_TIMEOUT;

    beforeAll((done) => {
        spyOn(retryService, 'debugLogAttempt').and.callThrough();

        const promise = httpService.get({
            mapError: (err => {
                return err;
            }),
            url: 'http://localhost/fail'
        }).toPromise();

        httpService.retryPromise(promise, {
            maxRetryAttempts: retryAttempts,
            useRetryForResponseCodes: useRetryForResponseCodes
        }).then(() => {
            throw Error(`Promise should not succeed`);
        }).catch(err => {
            console.error('Error: ', err);
            done();
        });
    });

    it(`Warning for retry attempt should have been called '0'`, () => {
        expect(retryService.debugLogAttempt).toHaveBeenCalledTimes(0);
    });
});

