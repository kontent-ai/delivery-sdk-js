import { SharedModels } from '../../lib';
import * as fakeErrorJson from '../fake-responses/errors/cm-error-with-validation-errors.json';
import { getTestClientWithCloudError } from '../setup';

describe('Content management error with validation errors', () => {

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

        expect(cloudError.validationErrors.length).toEqual(fakeErrorJson.validation_errors.length);

        for (const originalErrorMessage of fakeErrorJson.validation_errors) {
            const mappedValidationError = cloudError.validationErrors.find(m => m.message === originalErrorMessage.message);
            expect(mappedValidationError).toBeDefined();
            expect(mappedValidationError).toEqual(jasmine.any(SharedModels.ValidationError));
        }
    });
});

