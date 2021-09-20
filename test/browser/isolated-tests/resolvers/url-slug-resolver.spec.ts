import {
    ContentItem,
    Elements,
    IContentItemElements,
    ItemResponses,
    Link,
    sdkInfo,
    TypeResolver
} from '../../../../lib';
import { Actor, Context, MockQueryService, setup } from '../../setup';
import { HttpService } from '@kentico/kontent-core';
import * as warriorJson from '../fake-data/fake-warrior-response.json';

interface IMockMovieElements extends IContentItemElements {
    seoname: Elements.UrlSlugElement;
}

class MockMovie extends ContentItem<IMockMovieElements> {
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

    let response: ItemResponses.ViewContentItemResponse<IMockMovieElements>;
    let responseWithQueryConfig: ItemResponses.ViewContentItemResponse<IMockMovieElements>;

    const links: Link[] = [];

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<IMockMovieElements>(warriorJson, {});

        responseWithQueryConfig = mockQueryService.mockGetSingleItem<IMockMovieElements>(warriorJson, {
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
        expect(response.item.elements.seoname.resolveUrl()).toEqual('globalSlug/warrior');
    });

    it(`verifies locally defined url slug resolver (should have priority over global one)`, () => {
        expect((responseWithQueryConfig.item.elements.seoname as Elements.UrlSlugElement).resolveUrl()).toEqual(
            'querySlug/warrior'
        );
    });
});
