import { packageId, repoHost, version } from '../../../lib/library-version';
import { Context, setup, Movie } from '../../setup';
import { ItemResponses } from '../../../lib';

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
            .getObservable()
            .subscribe(r => {
                response = r as ItemResponses.DeliveryItemResponse<Movie>;
                done();
            });
    });

    it(`Verifies authorization header is actually present in sent request`, () => {
        const request = response.debug.response.rawRequest as XMLHttpRequest;
        const header = request['headers'][authorizationHeader];

        expect(header).toBeTruthy();
    });

});

