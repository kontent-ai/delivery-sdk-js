// setup
import { setup, Context, MockQueryService, Actor, warriorMovieJson } from '../../setup';

// models
import {
    Fields, ContentItem, ContentItemSystemAttributes, ItemResponses, TypeResolver, ILink
} from '../../../lib';

class MockMovie extends ContentItem {
    public seoname: Fields.UrlSlugField

    constructor() {
        super({
            linkResolver: (link: ILink) => {
                return 'globalSlug/' + link.url_slug;
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

    var response: ItemResponses.DeliveryItemResponse<MockMovie>;
    var responseWithQueryConfig: ItemResponses.DeliveryItemResponse<MockMovie>;

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<MockMovie>(warriorMovieJson, {});

        responseWithQueryConfig = mockQueryService.mockGetSingleItem<MockMovie>(warriorMovieJson, {
            linkResolver: (link: ILink) => {
                return 'querySlug/' + link.url_slug;
            }
        });
        done();
    })

    it(`verifies globally defined url slug resolver`, () => {
        expect(response.item.seoname.getUrl()).toEqual('globalSlug/warrior');
    });

    it(`verifies locally defined url slug resolver (should have priority over global one)`, () => {
        expect(responseWithQueryConfig.item.seoname.getUrl()).toEqual('querySlug/warrior');
    });
});

