import { Context, setup } from '../../setup';
import { DeliveryError } from '../../../../lib';

describe('Delivery errors', () => {
    const context = new Context();
    setup(context);

    const invalidCodename: string = 'the_invalid_codename';
    let succeeded: boolean;
    let error: unknown;

    beforeAll(async () => {
        try {
            await context.deliveryClient.item<any>(invalidCodename).toPromise();
            succeeded = true;
        } catch (err) {
            error = err;
            succeeded = false;
        }
    });

    it(`Response shouldn't succeed because the item does not exists`, () => {
        expect(succeeded).toEqual(false);
    });

    it(`Error should be an instance of DeliveryError`, () => {
        expect(error).toEqual(jasmine.any(DeliveryError));
    });

    it(`Error model should have all properties assigned`, () => {
        const baseError = error as DeliveryError;
        expect(baseError.errorCode).toBeGreaterThan(0);
        expect(baseError.specificCode).toBeGreaterThanOrEqual(0);
        expect(baseError.message).toBeDefined();
        expect(baseError.requestId).toBeDefined();
    });
});
