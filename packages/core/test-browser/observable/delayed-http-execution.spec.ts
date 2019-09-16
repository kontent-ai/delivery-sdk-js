import { HttpService, httpDebugger } from '../../lib';

describe('Delayed http execution when converting to Observable', () => {

    const httpService = new HttpService();

    beforeAll((done) => {
        spyOn(httpDebugger, 'debugStartHttpRequest').and.callThrough();
        spyOn(httpDebugger, 'debugResolveHttpRequest').and.callThrough();

        httpService.get({
            mapError: (err) => console.error('Debugging error', err),
            url: 'https://deliver.kontent.ai/da5abe9f-fdad-4168-97cd-b3464be2ccb9/items/warrior'
        });

        // give async request some time to execute
        setTimeout(() => {
            done();
        }, 3000);

    });

    it(`Http request should not be executed when observable is not subscribed to`, () => {
        expect(httpDebugger.debugResolveHttpRequest).toHaveBeenCalledTimes(0);
        expect(httpDebugger.debugStartHttpRequest).toHaveBeenCalledTimes(0);
    });
});

