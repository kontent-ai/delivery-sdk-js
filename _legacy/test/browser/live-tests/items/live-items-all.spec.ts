import { IDeliveryNetworkResponse, Responses } from '../../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Live items all', () => {
    const context = new Context();
    setup(context);

    const type: string = 'movie';
    let response: Responses.IListContentItemsAllResponse<Movie>;
    const responses: IDeliveryNetworkResponse<Responses.IListContentItemsResponse<Movie>, any>[] = [];

    const pages: number = 2;
    const limit: number = 2;

    beforeAll(async () => {
        response = (
            await context.deliveryClient
                .items<Movie>()
                .limitParameter(limit)
                .type(type)
                .toAllPromise({
                    responseFetched: (innerResponse, nextPage, continuationToken) => {
                        responses.push(innerResponse);
                    },
                    pages: pages
                })
        ).data;
    });

    it(`items should be defined`, () => {
        expect(response).toBeDefined();
    });

    it(`check correct number of items`, () => {
        expect(response.items.length).toEqual(pages * limit);
    });

    it(`items should have multiple responses`, () => {
        expect(response.responses.length).toEqual(pages);
        expect(response.responses.length).toEqual(responses.length);

        for (const innerResponse of response.responses) {
            expect(innerResponse.data).toBeDefined();
        }
    });
});
