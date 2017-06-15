// setup
import { setup, Context, Actor, Movie } from '../../setup';

// models
import { DeliveryItemListingResponse } from '../../../../lib';

// tests
describe('Equalsfilter', () => {

    var context = new Context();
    setup(context);

    var type: string = 'movie';
    var response: DeliveryItemListingResponse<Movie>;

    beforeAll((done) => {
        context.deliveryClient.items<Movie>().type(type)
            .equalsFilter('elements.title', 'Warrior')
            .get()
            .subscribe(r => {
                response = r;
                done()
            });
    })

    it(`there should be 1 result`, () => {
        expect(response.items.length).toEqual(1);
    });

    it(`check the returned item is the correct one`, () => {
        expect(response.items[0].system.codename).toEqual('warrior');
    });
});

