import { IResponse } from '@kentico/kontent-core';

export class FakeResponseFactory {
    getFakeSuccessResponse(json: any): IResponse<any> {
        const fakeResponse: any = {};

        fakeResponse.response = json;
        fakeResponse.status = 200;
        fakeResponse.originalEvent = {};
        fakeResponse.xhr = {};
        fakeResponse.request = {};

        return {
            data: json,
            rawResponse: fakeResponse,
            retryStrategy: {
                options: {},
                retryAttempts: 0
            },
            status: 200,
            headers: []
        };
    }
}

export const fakeResponseFactory = new FakeResponseFactory();
