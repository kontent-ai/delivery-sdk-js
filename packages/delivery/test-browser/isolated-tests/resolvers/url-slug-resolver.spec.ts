import { ContentItem, Fields, DeliveryHttpService, ItemResponses, Link, sdkInfo, TypeResolver } from '../../../lib';
import { Actor, Context, MockQueryService, setup, warriorMovieJson } from '../../setup';

class MockMovie extends ContentItem {
    public seoname: Fields.UrlSlugField;

    constructor() {
        super({
            linkResolver: (link: Link) => {
                return 'globalSlug/' + link.urlSlug;
            }
        });
    }
}

describe('URL slug resolver', () => {

    const context = new Context();
    const typeResolvers: TypeResolver[] = [];
    typeResolvers.push(new TypeResolver('movie', () => new MockMovie()));
    typeResolvers.push(new TypeResolver('actor', () => new Actor()));

    context.typeResolvers = typeResolvers;
    setup(context);

    const mockQueryService = new MockQueryService(context.getConfig(), new DeliveryHttpService(), {
        host: sdkInfo.host,
        name: sdkInfo.name,
        version: sdkInfo.version
    });

    let response: ItemResponses.DeliveryItemResponse<MockMovie>;
    let responseWithQueryConfig: ItemResponses.DeliveryItemResponse<MockMovie>;

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<MockMovie>(warriorMovieJson, {});

        responseWithQueryConfig = mockQueryService.mockGetSingleItem<MockMovie>(warriorMovieJson, {
            linkResolver: (link: Link) => {
                return 'querySlug/' + link.urlSlug;
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

