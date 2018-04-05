import { packageId, repoHost, version } from '../../../lib/library-version';
import { Context, setup, Movie } from '../../setup';
import { ItemResponses } from '../../../lib';

describe('Live SDK headers', () => {

    const versionHeader: string = 'X-KC-SDKID';

    const context = new Context();
    setup(context);

    const movieCodename: string = 'warrior';
    let response: ItemResponses.DeliveryItemResponse<Movie>;

    beforeAll((done) => {
        context.deliveryClient.item<Movie>(movieCodename)
            .get()
            .subscribe(r => {
                response = r as ItemResponses.DeliveryItemResponse<Movie>;
                done();
            });
    });

    it(`Verifies SDK Id version header is actually present in sent request`, () => {
        const request = response.debug.response.rawRequest as XMLHttpRequest;
        const header = request['headers'][versionHeader];

        expect(header).toBeTruthy();
    });

});

