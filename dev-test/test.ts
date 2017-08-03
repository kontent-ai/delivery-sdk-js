// setup
import { setup, Context, Actor, Movie } from '../test/setup';

// models
import { ItemResponses, FieldModels } from '../lib';


// dev tests
describe('Developer tests', () => {

    var context = new Context();
    setup(context);

    var movieCodename: string = 'warrior';
    var response: ItemResponses.DeliveryItemResponse<Movie>;
   
    beforeAll((done) => {
        context.deliveryClient.item<Movie>(movieCodename)
            .get()
            .subscribe(r => {
                response = r;
                done();
            })
    });

    it(`Test #1`, () => {
        console.log(response.item);
        var html = response.item.plot.getHtml();
        expect(response).toBeDefined();
    });

    it(`Link in rich text should be resolved using global url slug resolver`, () => {
        var html = response.item.plot.getHtml();
        expect(response).toBeDefined();
    });

    it(`Link in rich text should be resolved using url slug resolver defined by query`, () => {
        console.log(response.item);
        var html = response.item.plot.getHtml();
        console.log(html);
        expect(response).toBeDefined();
    });
});

