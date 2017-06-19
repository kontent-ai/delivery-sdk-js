// setup
import { setup, Context, MockQueryService, Actor, warriorMovieJson } from '../../setup';

// models
import {
    UrlSlugField, ContentItem, ContentItemSystemAttributes, DeliveryItemResponse, TypeResolver
} from '../../../../lib';

class MockMovie extends ContentItem {
    public seoname: UrlSlugField

    constructor() {
        super({
            urlSlugResolver: (item, urlSlug) => {
                return 'globalSlug/' + urlSlug;
            }
        })
    }
}
// tests
describe('URL slug resolver', () => {

    var context = new Context();
    var typeResolvers = [];
    typeResolvers.push(new TypeResolver('movie', () => new MockMovie()))
    typeResolvers.push(new TypeResolver('actor', () => new Actor()))

    context.typeResolvers = typeResolvers;
    setup(context);

    // mock query service
    var mockQueryService = new MockQueryService(context.getConfig());

    var response: DeliveryItemResponse<MockMovie>;
    var responseWithQueryConfig: DeliveryItemResponse<MockMovie>;

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<MockMovie>(warriorMovieJson, {});

        responseWithQueryConfig = mockQueryService.mockGetSingleItem<MockMovie>(warriorMovieJson, {
            urlSlugResolver: (item, urlSlug) => {
                return 'querySlug/' + urlSlug;
            }
        });
        done();
    })

    it(`verifies globally defined url slug resolver`, () => {
        expect(response.item.seoname.url).toEqual('globalSlug/warrior');
    });

    it(`verifies locally defined url slug resolver (should have priority over global one)`, () => {
        expect(responseWithQueryConfig.item.seoname.url).toEqual('querySlug/warrior');
    });
});

