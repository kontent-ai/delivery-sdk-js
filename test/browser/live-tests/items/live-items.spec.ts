import { ItemResponses } from '../../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Live items', () => {
    const context = new Context();
    setup(context);

    const type: string = 'movie';
    let response: ItemResponses.IListContentItemsResponse<Movie>;

    beforeAll(async () => {
        response = (await context.deliveryClient.items<Movie>().type(type).toPromise()).data;
    });

    it(`items should be defined`, () => {
        expect(response).toBeDefined();
    });

    it(`check correct number of items`, () => {
        expect(response.items.length).toEqual(6);
    });

    it(`items should have pagination`, () => {
        expect(response.pagination).toBeDefined();
    });

    it(`Linked items should be set`, () => {
        expect(Object.keys(response.linkedItems).length).toBeGreaterThan(0);
    });
});
