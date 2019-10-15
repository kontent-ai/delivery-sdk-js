import { ItemResponses } from '../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Live authorization headers', () => {

    const authorizationHeader: string = 'authorization';

    const context = new Context({
        globalQueryConfig: {
            usePreviewMode: true,
        },
        isDeveloperMode: true
    });

    setup(context);

    const movieCodename: string = 'warrior';
    let response: ItemResponses.ViewContentItemResponse<Movie>;

    beforeAll((done) => {
        context.deliveryClient.item<Movie>(movieCodename)
            .toObservable()
            .subscribe(r => {
                response = r as ItemResponses.ViewContentItemResponse<Movie>;
                done();
            });
    });

    it(`Verifies authorization header is actually present in sent request`, () => {
        if (!response.debug) {
            throw Error(`Debug is not available - use developer mode`);
        }
        const debugResponse = response.debug.response as any;
        const header = debugResponse.config.headers[authorizationHeader];

        expect(header).toBeTruthy();
    });

});

