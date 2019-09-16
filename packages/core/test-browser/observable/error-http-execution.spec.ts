import { HttpService, httpDebugger } from '../../lib';

describe('Errored http request', () => {

    const httpService = new HttpService();

    beforeAll((done) => {
        spyOn(httpDebugger, 'debugFailedHttpRequest').and.callThrough();

        httpService.get({
            mapError: (err) => console.error('Debugging error', err),
            url: 'https://deliver.kontent.ai/da5abe9f-fdad-4168-97cd-b3464be2ccb9/items/invalidItemShouldGet404'
        })
            .subscribe(() => {
                done();
            }, error => done());
    });

    it(`Http request should fail and call debugger`, () => {
        expect(httpDebugger.debugFailedHttpRequest).toHaveBeenCalledTimes(1);
    });
});

