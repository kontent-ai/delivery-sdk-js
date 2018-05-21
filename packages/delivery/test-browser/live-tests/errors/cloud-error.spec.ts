import { Context, Movie, setup } from '../../setup';
import { DeliveryCloudError } from '../../../lib/models/common/cloud-error.class';

describe('Cloud errors', () => {

    const context = new Context();
    setup(context);

    const invalidCodename: string = 'the_invalid_codename';
    let succeeded: boolean;
    let error: any | DeliveryCloudError;

    beforeAll((done) => {
        context.deliveryClient.item<Movie>(invalidCodename)
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
        expect(error).toEqual(jasmine.any(DeliveryCloudError));
    });

    it(`Error model should have all properties assigned`, () => {
        let allPropertiesAreAssigned = true;
        const cloudError = error as DeliveryCloudError;
        if (!(cloudError.errorCode >= 0) ||
            !cloudError.message ||
            !cloudError.requestId ||
            !(cloudError.specificCode >= 0)
        ) {
            allPropertiesAreAssigned = false;
        }
        expect(allPropertiesAreAssigned).toEqual(true);
    });
});

