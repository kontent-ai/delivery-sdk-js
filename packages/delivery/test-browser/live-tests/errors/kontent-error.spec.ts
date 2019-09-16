import { Context, Movie, setup } from '../../setup';
import { BaseKontentError } from '@kentico/kontent-core';

describe('Base errors', () => {

    const context = new Context();
    setup(context);

    const invalidCodename: string = 'the_invalid_codename';
    let succeeded: boolean;
    let error: any | BaseKontentError;

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

    it(`Error should be an instance of BaseKontentError`, () => {
        expect(error).toEqual(jasmine.any(BaseKontentError));
    });

    it(`Error model should have all properties assigned`, () => {
        const baseError = error as BaseKontentError;
        expect(baseError.errorCode).toBeGreaterThan(0);
        expect(baseError.specificCode).toBeGreaterThanOrEqual(0);
        expect(baseError.message).toBeDefined();
        expect(baseError.requestId).toBeDefined();
    });
});

