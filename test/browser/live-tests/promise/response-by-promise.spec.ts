import { Responses } from '../../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Response with Promises', () => {
    const context = new Context();
    setup(context);

    let response: Responses.IListContentItemsResponse<Movie>;

    beforeAll((done) => {
        context.deliveryClient
            .items<Movie>()
            .toPromise()
            .then((xResponse) => {
                response = xResponse.data;
                done();
            })
            .catch((err) => {
                throw err;
            });
    });

    it(`Response items should be retrieved and mapped just like with Promise`, () => {
        expect(response).toBeDefined();
    });
});
