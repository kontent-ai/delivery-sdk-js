import { IBaseResponse } from '@kentico/kontent-core';

export class FakeResponseFactory {

    getFakeSuccessResponse(json: any): IBaseResponse<any> {
        const fakeResponse: any = {};

        fakeResponse.response = json;
        fakeResponse.status = 200;
        fakeResponse.originalEvent = {};
        fakeResponse.xhr = {};
        fakeResponse.request = {};

        return {
            data: json,
            response: fakeResponse,
            status: 200,
            headers: []
        };
    }
}

export const fakeResponseFactory = new FakeResponseFactory();



