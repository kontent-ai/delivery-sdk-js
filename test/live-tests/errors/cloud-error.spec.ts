import { Context, Movie, setup } from '../../setup';
import { ICloudErrorResponse } from '../../../lib/interfaces/common/icloud-error-response.interface';

describe('Cloud errors', () => {

    const context = new Context();
    setup(context);

    const invalidCodename: string = 'the_invalid_codename';
    let succeeded: boolean;
    let error: any;

    beforeAll((done) => {
        context.deliveryClient.item<Movie>(invalidCodename)
            .get()
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

    it(`Error model should have all properties assigned`, () => {
        let allPropertiesAreAssigned = true;
        const cloudError = error as ICloudErrorResponse;
        if (!(cloudError.error_code >= 0) ||
            !cloudError.message ||
            !cloudError.request_id ||
            !(cloudError.specific_code >= 0)
        ) {
            allPropertiesAreAssigned = false;
        }
        expect(allPropertiesAreAssigned).toEqual(true);
    });
});

