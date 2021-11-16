import { IDeliveryNetworkResponse, Contracts, Responses } from '../../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Live items feed all', () => {
    const context = new Context();
    setup(context);

    let response: Responses.IListItemsFeedAllResponse<Movie>;
    const responses: IDeliveryNetworkResponse<Responses.IListItemsFeedResponse<Movie>, Contracts.IItemsFeedContract>[] = [];

    beforeAll(async () => {
        response = (
            await context.deliveryClient.itemsFeed<Movie>().toAllPromise({
                responseFetched: (innerResponse, nextPage, continuationToken) => {
                    responses.push(innerResponse);
                }
            })
        ).data;
    });

    it(`items should be defined`, () => {
        expect(response).toBeDefined();
    });

    it(`items should have multiple responses`, () => {
        expect(response.responses.length).toBeGreaterThan(0);
        expect(response.responses.length).toEqual(responses.length);

        for (const innerResponse of response.responses) {
            expect(innerResponse.data).toBeDefined();
        }
    });
});
