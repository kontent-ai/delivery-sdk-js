import { SharedModels } from '../../lib';
import * as fakeErrorJson from '../fake-responses/errors/fake-error.json';
import { getTestClientWithCloudError } from '../setup';

describe('Error handling', () => {

    let succeeded: boolean;
    let error: any | SharedModels.ContentManagementCloudError;

    beforeAll((done) => {
        getTestClientWithCloudError(fakeErrorJson).listContentItems()
            .toObservable()
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

    it(`Error should be an instance of ContentManagementCloudError`, () => {
        expect(error).toEqual(jasmine.any(SharedModels.ContentManagementCloudError));
    });

    it(`Error model should have all properties assigned`, () => {
        const cloudError = error as SharedModels.ContentManagementCloudError;
        expect(cloudError.errorCode).toEqual(fakeErrorJson.error_code);
        expect(cloudError.message).toEqual(fakeErrorJson.message);
        expect(cloudError.requestId).toEqual(fakeErrorJson.request_id);
        expect(cloudError.specificCode).toEqual(fakeErrorJson.specific_code);
    });
});

