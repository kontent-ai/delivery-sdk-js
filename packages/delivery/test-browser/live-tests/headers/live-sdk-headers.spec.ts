import { ItemResponses } from '../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Live SDK headers', () => {

    const versionHeader: string = 'X-KC-SDKID';

    const context = new Context();
    setup(context);

    const movieCodename: string = 'warrior';
    let response: ItemResponses.DeliveryItemResponse<Movie>;

    beforeAll((done) => {
        context.deliveryClient.item<Movie>(movieCodename)
            .getObservable()
            .subscribe(r => {
                response = r as ItemResponses.DeliveryItemResponse<Movie>;
                done();
            });
    });

    it(`Verifies SDK Id version header is actually present in sent request`, () => {
        const debugResponse = response.debug.response as any;
        const header = debugResponse.config.headers[versionHeader];

        expect(header).toBeTruthy();
    });

});

