import { AjaxResponse } from 'rxjs/Rx';

class FakeResponseFactory {

    getFakeSuccessResponse(json: any): AjaxResponse {
        var fakeResponse: any = {} as AjaxResponse;
        fakeResponse.response = json;
        fakeResponse.status = 200;
        fakeResponse.originalEvent = {};
        fakeResponse.xhr = {};
        fakeResponse.request = {};

        return fakeResponse;
    }
}

export var fakeResponseFactory = new FakeResponseFactory();



