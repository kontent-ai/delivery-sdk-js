import { ItemResponses } from '../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Live authorization headers', () => {

    const authorizationHeader: string = 'authorization';

    const context = new Context({
        usePreviewMode: true
    });

    setup(context);

    const movieCodename: string = 'warrior';
    let response: ItemResponses.DeliveryItemResponse<Movie>;

    beforeAll((done) => {
        context.deliveryClient.item<Movie>(movieCodename)
            .toObservable()
            .subscribe(r => {
                response = r as ItemResponses.DeliveryItemResponse<Movie>;
                done();
            });
    });

    it(`Verifies authorization header is actually present in sent request`, () => {
        const debugResponse = response.debug.response as any;
        const header = debugResponse.config.headers[authorizationHeader];

        expect(header).toBeTruthy();
    });

});

