import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { HttpService } from '../../lib';

describe('Http interceptors', () => {

    let requestInterceptorExecuted = false;
    let responseInterceptorExecuted = false;

    let requestInterceptorConfig: AxiosRequestConfig | undefined;
    let responseInterceptorResponse: AxiosResponse | undefined;

    const httpService = new HttpService({
        requestInterceptor: (config) => {
            requestInterceptorExecuted = true;
            requestInterceptorConfig = config;
            return config;
        },
        responseInterceptor: (xResponse) => {
            responseInterceptorExecuted = true;
            responseInterceptorResponse = xResponse;
            return xResponse;
        }
    });

    beforeAll((done) => {
        httpService.get({
            mapError: (err) => new Error('This request should not fail'),
            url: 'https://deliver.kontent.ai/da5abe9f-fdad-4168-97cd-b3464be2ccb9/items/warrior'
        })
            .subscribe(result => {
                done();
            });
    });

    it(`Request intercerptor should be executed`, () => {
        expect(requestInterceptorExecuted).toBeTruthy();
    });

    it(`Response intercerptor should be executed`, () => {
        expect(responseInterceptorExecuted).toBeTruthy();
    });

    it(`Request interceptor config should be set `, () => {
        expect(requestInterceptorConfig).toBeDefined();
    });

    it(`Response interceptor response should be set `, () => {
        expect(responseInterceptorResponse).toBeDefined();
    });
});

