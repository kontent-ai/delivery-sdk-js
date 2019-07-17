import { ItemResponses } from '../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Live content type header', () => {

    const headerName: string = 'Content-Type';

    const context = new Context();
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

    it(`'${headerName}' should not be sent in GET requests of delivery API`, () => {
        const debugResponse = response.debug.response as any;
        const header = debugResponse.config.headers[headerName];

        expect(header).toBeFalsy();
    });

});

