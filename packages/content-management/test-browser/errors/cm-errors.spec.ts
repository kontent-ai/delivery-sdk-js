import { CloudError } from 'kentico-cloud-core';

import { cmTestClientWithInvalidApiKey, getTestClientWithCloudError } from '../setup';
import * as fakeErrorJson from '../fake-responses/fake-error.json';

describe('Error handling', () => {

    let succeeded: boolean;
    let error: any | CloudError;

    beforeAll((done) => {
        getTestClientWithCloudError(fakeErrorJson).listContentItems()
            .getObservable()
            .subscribe(response => {
                succeeded = true;
                done();
            },
                err => {
                    error = err;
                    succeeded = false;
                    done();
                });
    });

    it(`Response shouldn't succeed because the item does not exists`, () => {
        expect(succeeded).toEqual(false);
    });

    it(`Error should be an instance of CloudError`, () => {
        expect(error).toEqual(jasmine.any(CloudError));
    });

    it(`Error model should have all properties assigned`, () => {
        const cloudError = error as CloudError;
        expect(cloudError.errorCode).toEqual(fakeErrorJson.error_code);
        expect(cloudError.message).toEqual(fakeErrorJson.message);
        expect(cloudError.requestId).toEqual(fakeErrorJson.request_id);
        expect(cloudError.specificCode).toEqual(fakeErrorJson.specific_code);
    });
});

