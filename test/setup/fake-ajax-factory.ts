import { AjaxResponse } from 'rxjs/Rx';
import { BaseResponse } from '../../lib/services/http/base-response.class';

class FakeResponseFactory {

    getFakeSuccessResponse(json: any): BaseResponse {
        const fakeResponse: any = {} as AjaxResponse;

        fakeResponse.response = json;
        fakeResponse.status = 200;
        fakeResponse.originalEvent = {};
        fakeResponse.xhr = {};
        fakeResponse.request = {};

        return new BaseResponse(json, fakeResponse);
    }
}

export const fakeResponseFactory = new FakeResponseFactory();



