import { ItemResponses } from '../../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Pagination', () => {
    const context = new Context();
    setup(context);

    const type: string = 'movie';
    let response: ItemResponses.ListContentItemsResponse<Movie>;

    beforeAll(async () => {
        response = (
            await context.deliveryClient.items<Movie>().type(type).limitParameter(5).skipParameter(1).toPromise()
        ).data;
    });

    it(`pagination should be defined`, () => {
        expect(response.pagination).toBeDefined();
    });

    it(`check count`, () => {
        expect(response.pagination.count).toEqual(5);
    });

    it(`check limit`, () => {
        expect(response.pagination.limit).toEqual(5);
    });

    it(`check skip`, () => {
        expect(response.pagination.skip).toEqual(1);
    });

    it(`check pagination count`, () => {
        expect(response.pagination.nextPage).toEqual('');
    });
});
