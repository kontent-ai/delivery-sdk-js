import {
    IResponse,
    IHttpDeleteQueryCall,
    IHttpGetQueryCall,
    IHttpPatchQueryCall,
    IHttpPostQueryCall,
    IHttpPutQueryCall,
    IHttpQueryOptions,
    IHttpService,
    IHttpCancelRequestToken
} from '@kontent-ai/core-sdk';

import { DeliveryClient } from '../../../../lib';

class CustomHttpService implements IHttpService<undefined> {
    getAsync<TRawData>(call: IHttpGetQueryCall, options?: IHttpQueryOptions<undefined>): Promise<IResponse<TRawData>> {
        return this.resolveTestCall();
    }

    postAsync<TRawData>(
        call: IHttpPostQueryCall,
        options?: IHttpQueryOptions<undefined>
    ): Promise<IResponse<TRawData>> {
        return this.resolveTestCall();
    }

    putAsync<TRawData>(call: IHttpPutQueryCall, options?: IHttpQueryOptions<undefined>): Promise<IResponse<TRawData>> {
        return this.resolveTestCall();
    }

    patchAsync<TRawData>(
        call: IHttpPatchQueryCall,
        options?: IHttpQueryOptions<undefined>
    ): Promise<IResponse<TRawData>> {
        return this.resolveTestCall();
    }

    deleteAsync<TRawData>(
        call: IHttpDeleteQueryCall,
        options?: IHttpQueryOptions<undefined>
    ): Promise<IResponse<TRawData>> {
        return this.resolveTestCall();
    }

    createCancelToken(): IHttpCancelRequestToken<undefined> {
        return {
            cancel: () => {},
            token: undefined
        };
    }

    private resolveTestCall(): Promise<IResponse<any>> {
        const promise = new Promise<IResponse<any>>((resolve, reject) => {
            resolve({
                data: {},
                headers: [],
                rawResponse: {},
                retryStrategy: {
                    options: {},
                    retryAttempts: 3
                },
                status: 200
            });
        });
        return promise;
    }
}

describe('Custom Http service', () => {
    const client = new DeliveryClient({
        environmentId: 'xxx',
        httpService: new CustomHttpService()
    });

    it(`Should use custom http service`, () => {
        // this is fragile, but we don't want to expose these properties for now
        const httpService = client['queryService']['httpService'];
        expect(httpService).toEqual(jasmine.any(CustomHttpService));
    });
});
