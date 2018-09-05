import { HttpService, httpDebugger } from '../../lib';

describe('Http execution upon observable subscription', () => {

    const httpService = new HttpService();

    beforeAll((done) => {
        spyOn(httpDebugger, 'debugStartHttpRequest').and.callThrough();
        spyOn(httpDebugger, 'debugResolveHttpRequest').and.callThrough();

        const observable = httpService.get({
            mapError: (err) => console.error('Debugging error', err),
            url: 'https://deliver.kenticocloud.com/da5abe9f-fdad-4168-97cd-b3464be2ccb9/items/warrior'
        })
        .subscribe(response => {
            done();
        });

    });

    it(`Http request should have been executed upon subscription`, () => {
        expect(httpDebugger.debugResolveHttpRequest).toHaveBeenCalledTimes(1);
        expect(httpDebugger.debugStartHttpRequest).toHaveBeenCalledTimes(1);
    });
});

