import { CloudError } from 'kentico-cloud-core';

import { cmTestClientWithInvalidApiKey } from '../setup';

describe('Error handling', () => {

    let succeeded: boolean;
    let error: any | CloudError;

    beforeAll((done) => {
        cmTestClientWithInvalidApiKey.listContentItems()
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
        expect(cloudError.errorCode).toBeGreaterThan(0);
        expect(cloudError.message).toBeDefined();
        expect(cloudError.requestId).toBeDefined();
    });
});

