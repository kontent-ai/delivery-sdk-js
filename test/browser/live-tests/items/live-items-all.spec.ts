import { IKontentNetworkResponse, ItemResponses } from '../../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Live items all', () => {
    const context = new Context();
    setup(context);

    const type: string = 'movie';
    let response: ItemResponses.IListContentItemsAllResponse<Movie>;
    const responses: IKontentNetworkResponse<ItemResponses.IListContentItemsResponse<Movie>>[] = [];

    beforeAll(async () => {
        response = (
            await context.deliveryClient
                .items<Movie>()
                .listQueryConfig({
                    responseFetched: (innerResponse, nextPage, continuationToken) => {
                        responses.push(innerResponse);
                    }
                })
                .limitParameter(2)
                .type(type)
                .toAllPromise()
        ).data;
    });

    it(`items should be defined`, () => {
        expect(response).toBeDefined();
    });

    it(`check correct number of items`, () => {
        expect(response.items.length).toEqual(6);
    });

    it(`items should have multiple responses`, () => {
        expect(response.responses.length).toBeGreaterThan(2);
        expect(response.responses.length).toEqual(responses.length);

        for (const innerResponse of response.responses) {
            expect(innerResponse.data).toBeDefined();
        }
    });
});
