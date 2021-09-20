import { ItemResponses } from '../../../../lib';
import { Context, IMovieElements, setup } from '../../setup';

describe('Response with Promises', () => {
    const context = new Context();
    setup(context);

    let response: ItemResponses.ListContentItemsResponse<IMovieElements>;

    beforeAll((done) => {
        context.deliveryClient
            .items<IMovieElements>()
            .toPromise()
            .then((xResponse) => {
                response = xResponse.data;
                done();
            });
    });

    it(`Response items should be retrieved and mapped just like with Promise`, () => {
        expect(response).toEqual(jasmine.any(ItemResponses.ListContentItemsResponse));
    });
});
