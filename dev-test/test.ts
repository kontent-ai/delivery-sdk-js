// setup
import { setup, Context, Actor, Movie } from '../test/setup';

// models
import { ItemResponses, FieldModels, IContentItem, ContentItem } from '../lib';


// dev tests
describe('Developer tests', () => {

    const context = new Context();
    // remove type resolvers for testing
    context.typeResolvers = [];
    setup(context);

    const movieCodename: string = 'warrior';
    let response: ItemResponses.DeliveryItemResponse<Movie>;

    beforeAll((done) => {
        context.deliveryClient.item<Movie>(movieCodename)
            .get()
            .subscribe(r => {
                console.log(r);
                response = r;
                done();
            })
    });

    it(`IContentItem should be returned`, () => {
        expect(response.item).toEqual(jasmine.any(ContentItem));
    });

});

