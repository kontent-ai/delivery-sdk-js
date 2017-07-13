// setup
import { setup, Context, Actor, Movie } from '../test/setup';

// models
import { ItemResponses, FieldModels } from '../lib';

// tests
describe('Developer tests', () => {

    var context = new Context();
    setup(context);

    var movieCodename: string = 'warrior';
    var response: ItemResponses.DeliveryItemResponse<Movie>;

    beforeAll((done) => {
        context.deliveryClient.item<Movie>(movieCodename)
            .get()
            .toPromise()
            .then(r => response = r)
            .catch(err => console.log('error:' + err));
    });

    it(`Text #1`, () => {
        console.log(response.item);
        expect(response).toBeDefined();
    });
});

