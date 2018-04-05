import { ContentItem, Fields, ILink, ItemResponses, TypeResolver } from '../../../lib';
import { packageId, repoHost, version } from '../../../lib/library-version';
import { HttpService } from '../../../lib/services/http/http.service';
import { Actor, Context, MockQueryService, setup, warriorMovieJson } from '../../setup';

class MockMovie extends ContentItem {
    public seoname: Fields.UrlSlugField;

    constructor() {
        super({
            linkResolver: (link: ILink) => {
                return 'globalSlug/' + link.url_slug;
            }
        });
    }
}
// tests
describe('URL slug resolver', () => {

    const context = new Context();
    const typeResolvers = [];
    typeResolvers.push(new TypeResolver('movie', () => new MockMovie()));
    typeResolvers.push(new TypeResolver('actor', () => new Actor()));

    context.typeResolvers = typeResolvers;
    setup(context);

    const mockQueryService = new MockQueryService(context.getConfig(), new HttpService(), {
        host: repoHost,
        name: packageId,
        version: version
    });

    let response: ItemResponses.DeliveryItemResponse<MockMovie>;
    let responseWithQueryConfig: ItemResponses.DeliveryItemResponse<MockMovie>;

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<MockMovie>(warriorMovieJson, {});

        responseWithQueryConfig = mockQueryService.mockGetSingleItem<MockMovie>(warriorMovieJson, {
            linkResolver: (link: ILink) => {
                return 'querySlug/' + link.url_slug;
            }
        });
        done();
    });

    it(`verifies globally defined url slug resolver`, () => {
        expect(response.item.seoname.getUrl()).toEqual('globalSlug/warrior');
    });

    it(`verifies locally defined url slug resolver (should have priority over global one)`, () => {
        expect(responseWithQueryConfig.item.seoname.getUrl()).toEqual('querySlug/warrior');
    });
});

