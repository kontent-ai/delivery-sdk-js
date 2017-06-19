// setup
import { setup, Context, MockQueryService, Actor, warriorMovieJson } from '../../setup';

// models
import {
    RichTextField, TextField, ContentItem, ContentItemSystemAttributes, DeliveryItemResponse, TypeResolver
} from '../../../../lib';

class MockMovie extends ContentItem {
    public plot: RichTextField
}

class MockActor extends ContentItem {
    public first_name: TextField

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

    var response: DeliveryItemResponse<MockMovie>;
    var responseWithQueryConfig: DeliveryItemResponse<MockMovie>;

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<MockMovie>(warriorMovieJson, {});

        responseWithQueryConfig = mockQueryService.mockGetSingleItem<MockMovie>(warriorMovieJson, {
            richTextResolver: (item: MockActor) => {
                 return `<h2>${item.first_name.text}</h2>`;
            }
        });
        done();
    })

    it(`verifies globally defined rich text resolver`, () => {
        var expectedHtml = `<p>The youngest son of an alcoholic former boxer returns home, where he's trained by his father for competition in a mixed martial arts tournament - a path that puts the fighter on a collision course with his estranged, older brother.</p>\n<p>Stars:&nbsp;</p>\n<div type=\"application/kenticocloud\" data-type=\"item\" data-codename=\"tom_hardy\"><h1>Tom</h1></div><div type=\"application/kenticocloud\" data-type=\"item\" data-codename=\"joel_edgerton\"><h1>Joel</h1></div>`;
        expect(response.item.plot.getHtml()).toEqual(expectedHtml);
    });

    it(`verifies locally defined rich text resolver (should have priority over global one)`, () => {
         var expectedHtml = `<p>The youngest son of an alcoholic former boxer returns home, where he's trained by his father for competition in a mixed martial arts tournament - a path that puts the fighter on a collision course with his estranged, older brother.</p>\n<p>Stars:&nbsp;</p>\n<div type=\"application/kenticocloud\" data-type=\"item\" data-codename=\"tom_hardy\"><h2>Tom</h2></div><div type=\"application/kenticocloud\" data-type=\"item\" data-codename=\"joel_edgerton\"><h2>Joel</h2></div>`;
        expect(responseWithQueryConfig.item.plot.getHtml()).toEqual(expectedHtml);
    });
});

