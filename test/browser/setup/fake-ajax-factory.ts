import { IResponse } from '@kentico/kontent-core';

export class FakeResponseFactory {
    getFakeSuccessResponse(json: any): IResponse<any> {
        const fakeResponse: IResponse<any> = {
            data: json,
            headers: [],
            rawResponse: json,
            retryStrategy: {
                options: {},
                retryAttempts: 0
            },
            status: 200
        };

        return fakeResponse;
    }
}

export const fakeResponseFactory = new FakeResponseFactory();
