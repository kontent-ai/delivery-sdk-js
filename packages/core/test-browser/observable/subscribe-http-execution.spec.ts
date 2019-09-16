import { httpDebugger, HttpService, IBaseResponse } from '../../lib';

describe('Http execution upon observable subscription', () => {

    const httpService = new HttpService();
    let response: IBaseResponse<any>;

    beforeAll((done) => {
        spyOn(httpDebugger, 'debugStartHttpRequest').and.callThrough();
        spyOn(httpDebugger, 'debugResolveHttpRequest').and.callThrough();

        httpService.get({
            mapError: (err) => new Error('This request should not fail'),
            url: 'https://deliver.kontent.ai/da5abe9f-fdad-4168-97cd-b3464be2ccb9/items/warrior'
        })
            .subscribe(result => {
                response = result;
                done();
            });

    });

    it(`Http request should have been executed upon subscription`, () => {
        expect(httpDebugger.debugResolveHttpRequest).toHaveBeenCalledTimes(1);
        expect(httpDebugger.debugStartHttpRequest).toHaveBeenCalledTimes(1);

        expect(response.data).toBeDefined();
        expect(response.data.item).toBeDefined();
    });
});

