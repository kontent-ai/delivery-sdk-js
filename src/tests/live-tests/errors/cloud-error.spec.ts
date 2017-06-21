// setup
import { setup, Context, Actor, Movie } from '../../setup';

// models
import { CloudError } from '../../../../lib';

// tests
describe('Cloud errors', () => {

    var context = new Context();
    setup(context);

    var invalidCodename: string = 'the_invalid_codename';
    var succeeded: boolean;
    var error: any;

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

    it(`response shouldn't succeed because the item does not exists`, () => {
        expect(succeeded).toEqual(false);
    });

    it(`response should be an instance of 'CloudError'`, () => {
        expect(error).toEqual(jasmine.any(CloudError));
    });

    it(`'CloudError' model should have all properties assigned`, () => {
        var allPropertiesAreAssigned = true;
        var cloudError = error as CloudError;
        if (!(cloudError.error_code >= 0) ||
            !cloudError.message ||
            !cloudError.rawError ||
            !cloudError.request_id ||
            !(cloudError.specific_code >= 0)
        ) {
            allPropertiesAreAssigned = false;
        }
        expect(allPropertiesAreAssigned).toEqual(true);
    });
});

