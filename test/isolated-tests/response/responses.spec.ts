// setup
import { setup, Context, Movie, Actor, MockQueryService, warriorMovieJson } from '../../setup';

// models
import { ItemResponses } from '../../../lib';

// tests
describe('Responses', () => {

    var context = new Context();
    setup(context);

    // mock query service
    var mockQueryService = new MockQueryService(context.getConfig())

    var response: ItemResponses.DeliveryItemResponse<Movie>;

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<Movie>(warriorMovieJson, {});
        done();
    })

    it(`DeliveryItemListingResponse should be initialize properties for invalid item`, () => {
        var response = new ItemResponses.DeliveryItemListingResponse(null as any, {} as any, {} as any);
        var responseWithEmptyArray = new ItemResponses.DeliveryItemListingResponse([] as any, {} as any, {} as any);

        expect(response.isEmpty).toEqual(true);
        expect(response.firstItem).toEqual(undefined);
        expect(response.lastItem).toEqual(undefined);
        expect(responseWithEmptyArray.firstItem).toEqual(undefined);
        expect(responseWithEmptyArray.lastItem).toEqual(undefined);
    });

    it(`DeliveryItemListingResponse should be initialize properties for invalid item`, () => {
        var response = new ItemResponses.DeliveryItemResponse(null as any, {} as any);
        var responseWithItem = new ItemResponses.DeliveryItemResponse({'test':1} as any, {} as any);

        expect(response.isEmpty).toEqual(true);
        expect(responseWithItem.isEmpty).toEqual(false);
    });

});

