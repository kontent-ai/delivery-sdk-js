import { ContentItem, Elements, ItemResponses, Link, sdkInfo, TypeResolver } from '../../../../lib';
import { Actor, Context, MockQueryService, setup } from '../../setup';
import { HttpService } from '@kentico/kontent-core';
import * as warriorJson from '../fake-data/fake-warrior-response.json';

class MockMovie extends ContentItem {
    public seoname!: Elements.UrlSlugElement;

    constructor() {
        super({
            urlSlugResolver: (link: Link) => {
                return {
                    url: 'globalSlug/' + link.urlSlug
                };
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

    const mockQueryService = new MockQueryService(context.getConfig(), new HttpService(), {
        host: sdkInfo.host,
        name: sdkInfo.name,
        version: sdkInfo.version
    });

    let response: ItemResponses.ViewContentItemResponse<MockMovie>;
    let responseWithQueryConfig: ItemResponses.ViewContentItemResponse<MockMovie>;

    const links: Link[] = [];

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<MockMovie>(warriorJson, {});

        responseWithQueryConfig = mockQueryService.mockGetSingleItem<MockMovie>(warriorJson, {
            urlSlugResolver: (link: Link) => {
                // store links
                links.push(link);

                return {
                    url: 'querySlug/' + link.urlSlug
                };
            }
        });
        done();
    });

    it(`verifies globally defined url slug resolver`, () => {
        expect(response.item.seoname.resolveUrl()).toEqual('globalSlug/warrior');
    });

    it(`verifies locally defined url slug resolver (should have priority over global one)`, () => {
        expect(responseWithQueryConfig.item.seoname.resolveUrl()).toEqual('querySlug/warrior');
    });
});

