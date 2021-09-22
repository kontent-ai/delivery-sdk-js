import { IKontentNetworkResponse, ItemResponses } from '../../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Live items feed all', () => {
    const context = new Context();
    setup(context);

    let response: ItemResponses.IListItemsFeedAllResponse<Movie>;
    const responses: IKontentNetworkResponse<ItemResponses.IListItemsFeedResponse<Movie>>[] = [];

    beforeAll(async () => {
        response = (
            await context.deliveryClient
                .itemsFeed<Movie>()
                .listQueryConfig({
                    responseFetched: (innerResponse, nextPage, continuationToken) => {
                        responses.push(innerResponse);
                    }
                })
                .toAllPromise()
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
