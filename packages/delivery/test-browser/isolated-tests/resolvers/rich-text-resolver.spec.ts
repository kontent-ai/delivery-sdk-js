import { ContentItem, Fields, ItemResponses, sdkInfo, TypeResolver } from '../../../lib';
import { Context, MockQueryService, setup, warriorMovieJson } from '../../setup';
import { HttpService } from 'kentico-cloud-core';

class MockMovie extends ContentItem {
    public plot: Fields.RichTextField;
}

class MockActor extends ContentItem {
    public first_name: Fields.TextField;

    constructor() {
        super({
            richTextResolver: (item: MockActor, context) => {
                return `<h1>${item.first_name.text}</h1>`;
            }
        });
    }
}

describe('Rich text resolver', () => {

    const context = new Context();
    const typeResolvers: TypeResolver[] = [];
    typeResolvers.push(new TypeResolver('movie', () => new MockMovie()));
    typeResolvers.push(new TypeResolver('actor', () => new MockActor()));

    context.typeResolvers = typeResolvers;
    setup(context);

    const mockQueryService = new MockQueryService(context.getConfig(), new HttpService(), {
        host: sdkInfo.host,
        name: sdkInfo.name,
        version: sdkInfo.version
    });

    let response: ItemResponses.DeliveryItemResponse<MockMovie>;
    let responseWithQueryConfig: ItemResponses.DeliveryItemResponse<MockMovie>;

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<MockMovie>(warriorMovieJson, {});

        responseWithQueryConfig = mockQueryService.mockGetSingleItem<MockMovie>(warriorMovieJson, {
            richTextResolver: (item: MockActor, richTextContext) => {
                return `<h2>${item.first_name.text}</h2>`;
            }
        });
        done();
    });

    it(`verifies globally defined rich text contains correct html of linked item`, () => {
        const containsHtml = '<h1>Tom</h1>';
        expect(response.item.plot.getHtml()).toContain(containsHtml);
    });

    it(`verifies locally defined rich text resolver override global resolvers and contains correct html`, () => {
        const containsHtml = '<h2>Tom</h2>';
        expect(responseWithQueryConfig.item.plot.getHtml()).toContain(containsHtml);
    });
});

