import { Context, Movie, setup } from '../../setup';
import { CloudError } from 'kentico-cloud-core';

describe('Cloud errors', () => {

    const context = new Context();
    setup(context);

    const invalidCodename: string = 'the_invalid_codename';
    let succeeded: boolean;
    let error: any | CloudError;

    beforeAll((done) => {
        context.deliveryClient.item<Movie>(invalidCodename)
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

    it(`Error should be an instance of CloudError`, () => {
        expect(error).toEqual(jasmine.any(CloudError));
    });

    it(`Error model should have all properties assigned`, () => {
        const cloudError = error as CloudError;
        expect(cloudError.errorCode).toBeGreaterThan(0);
        expect(cloudError.specificCode).toBeGreaterThanOrEqual(0);
        expect(cloudError.message).toBeDefined();
        expect(cloudError.requestId).toBeDefined();
    });
});

