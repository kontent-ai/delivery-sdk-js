// setup
import { setup, Context, Movie, Actor, MockQueryService, warriorMovieJson } from '../../setup';

// models
import {
    TextField, ContentItem, ContentItemSystemAttributes, DeliveryItemResponse
} from '../../../../lib';

// tests
describe('Modular content field', () => {

    var context = new Context();
    setup(context);

    // mock query service
    var mockQueryService = new MockQueryService(context.getConfig())

    var response: DeliveryItemResponse<Movie>;

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<Movie>(warriorMovieJson, {});
        done();
    })

    it(`checks that modular items are defined`, () => {
        expect(response.item.stars).toBeDefined();
    });

    it(`checks that correct number of modular items are created`, () => {
        expect(response.item.stars.length).toEqual(2);
    });

    it(`checks that modular items are of proper type`, () => {
        expect(response.item.stars[0]).toEqual(jasmine.any(Actor));
    });

    it(`checks that text field in first modular item is set`, () => {
        expect(response.item.stars[0].firstName.text).toEqual('Tom');
    });

      it(`checks that text field in second modular item is set`, () => {
        expect(response.item.stars[1].firstName.text).toEqual('Joel');
    });
});

