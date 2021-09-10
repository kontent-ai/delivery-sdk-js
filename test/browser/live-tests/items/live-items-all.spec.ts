import { ItemResponses } from '../../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Live items all', () => {
    const context = new Context();
    setup(context);

    const type: string = 'movie';
    let response: ItemResponses.ListContentItemsAllResponse<Movie>;
    const responses: ItemResponses.ListContentItemsResponse<Movie>[] = [];

    beforeAll(async () => {
        response = await context.deliveryClient
            .items<Movie>()
            .listQueryConfig({
                responseFetched: (innerResponse, nextPage, continuationToken) => {
                    responses.push(innerResponse);
                }
            })
            .limitParameter(2)
            .type(type)
            .toAllPromise();
    });

    it(`items should be defined`, () => {
        expect(response).toBeDefined();
        expect(response).toEqual(jasmine.any(ItemResponses.ListContentItemsAllResponse));
    });

    it(`check correct number of items`, () => {
        expect(response.items.length).toEqual(6);
    });

    it(`items should have multiple responses`, () => {
        expect(response.responses.length).toBeGreaterThan(2);
        expect(response.responses.length).toEqual(responses.length);

        for (const innerResponse of response.responses) {
            expect(innerResponse).toEqual(jasmine.any(ItemResponses.ListContentItemsResponse));
        }
    });

    it(`debug property should be set for all items`, () => {
        response.items.forEach((item) => {
            expect(item).toEqual(jasmine.any(Movie));
            expect(item._raw).toBeDefined();
            expect(item._raw.elements).toBeDefined();
        });
    });
});
