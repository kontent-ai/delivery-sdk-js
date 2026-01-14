import { IDeliveryNetworkResponse } from '../../../../lib';
import { Context, setup } from '../../setup';

describe('Network response', () => {
    const context = new Context();
    setup(context);

    let response: IDeliveryNetworkResponse<any, any>;

    beforeAll(async () => {
        response = await context.deliveryClient
            .itemsFeed()
            .toPromise();
    });

    it(`response should contain network response data`, () => {
        expect(response.response.headers).toBeDefined();
        expect(response.response.data).toBeDefined();
        expect(response.response.rawResponse).toBeDefined();
        expect(response.response.retryStrategy).toBeDefined();
        expect(response.hasStaleContent).toEqual(false);
        expect(response.xContinuationToken).toBeUndefined();
        expect(response.response.status).toEqual(200);
    });
});
