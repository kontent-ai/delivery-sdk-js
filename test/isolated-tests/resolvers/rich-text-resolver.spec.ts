// setup
import { setup, Context, MockQueryService, Actor, warriorMovieJson } from '../../setup';

// models
import {
   Fields, ContentItem, ContentItemSystemAttributes, ItemResponses, TypeResolver
} from '../../../lib';

import { RichTextResolver } from '../../../lib/fields/rich-text-resolver.class';
import { TypeResolverService } from '../../../lib/services/type-resolver.service';

class MockMovie extends ContentItem {
    public plot: Fields.RichTextField
}

class MockActor extends ContentItem {
    public first_name: Fields.TextField

    constructor() {
        super({
            richTextResolver: (item: MockActor) => {
                return `<h1>${item.first_name.text}</h1>`;
            }
        })
    }
}

// tests
describe('Rich text resolver', () => {

    var context = new Context();
    var typeResolvers = [];
    typeResolvers.push(new TypeResolver('movie', () => new MockMovie()))
    typeResolvers.push(new TypeResolver('actor', () => new MockActor()))

    context.typeResolvers = typeResolvers;
    setup(context);

    // mock query service
    var mockQueryService = new MockQueryService(context.getConfig());

    var response: ItemResponses.DeliveryItemResponse<MockMovie>;
    var responseWithQueryConfig: ItemResponses.DeliveryItemResponse<MockMovie>;

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<MockMovie>(warriorMovieJson, {});

        responseWithQueryConfig = mockQueryService.mockGetSingleItem<MockMovie>(warriorMovieJson, {
            richTextResolver: (item: MockActor) => {
                return `<h2>${item.first_name.text}</h2>`;
            }
        });
        done();
    })

    it(`verifies globally defined rich text contains correct html`, () => {
        var containsHtml = '<h1>Tom</h1>';
        expect(response.item.plot.getHtml()).toContain(containsHtml);
    });

    it(`verifies locally defined rich text resolver (should have priority over global one) contains correct html`, () => {
        var containsHtml = '<h2>Tom</h2>';
        expect(responseWithQueryConfig.item.plot.getHtml()).toContain(containsHtml);
    });
});

