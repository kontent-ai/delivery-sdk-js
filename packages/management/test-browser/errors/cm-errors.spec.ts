import { SharedModels } from '../../lib';
import * as fakeErrorJson from '../fake-responses/errors/fake-error.json';
import { getTestClientWithBaseKontentError } from '../setup';

describe('Error handling', () => {

    let succeeded: boolean;
    let error: any | SharedModels.ContentManagementBaseKontentError;

    beforeAll((done) => {
        getTestClientWithBaseKontentError(fakeErrorJson).listContentItems()
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

    it(`Error should be an instance of ContentManagementBaseKontentError`, () => {
        expect(error).toEqual(jasmine.any(SharedModels.ContentManagementBaseKontentError));
    });

    it(`Error model should have all properties assigned`, () => {
        const contentManagementError = error as SharedModels.ContentManagementBaseKontentError;
        expect(contentManagementError.errorCode).toEqual(fakeErrorJson.error_code);
        expect(contentManagementError.message).toEqual(fakeErrorJson.message);
        expect(contentManagementError.requestId).toEqual(fakeErrorJson.request_id);
        expect(contentManagementError.specificCode).toEqual(fakeErrorJson.specific_code);
    });
});

