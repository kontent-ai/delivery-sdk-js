// setup
import { setup, Context, Movie, Actor } from '../../setup';

// models
import { Fields, ContentItem, ContentItemSystemAttributes } from '../../../lib';

class ActorMock extends ContentItem {
    firstName: Fields.TextField;
    system: ContentItemSystemAttributes;
    url: Fields.UrlSlugField;

    constructor(id: string, codename: string, firstName: string) {
        super()
        this.firstName = new Fields.TextField('firstName', firstName);
        this.system = new ContentItemSystemAttributes(id, 'name', codename, 'actor', null, 'en', []);
        this.url = new Fields.UrlSlugField('url', codename, this, (item: ActorMock, urlSlug: string) => {
            return `/actor-rt/` + urlSlug;
        }, true);
    }
}

// tests
describe('RichTextField', () => {

    // prepare modular items
    var modularItems: ActorMock[] = [];

    var tomHardyId = 'd1557cb1-d7ec-4d04-9742-f86b52bc34fc';
    var joelEdgertonId = '3294e4b0-e58b-49d7-85fa-5bc9a86556ec';

    var tomHardy = new ActorMock(tomHardyId, 'tom_hardy', 'Tom');
    var joelEdgerton = new ActorMock(joelEdgertonId, 'joel_edgerton', 'Joel');

    modularItems.push(tomHardy);
    modularItems.push(joelEdgerton);

    // prepare html
    var html = `
    <p>The youngest son of an alcoholic former boxer returns home, where he's trained by his father for competition in a mixed martial arts tournament - a path that puts the fighter on a collision course with his estranged, older brother.</p>\n<p>Stars:&nbsp;</p>\n<object type=\"application/kenticocloud\" data-type=\"item\" data-codename=\"tom_hardy\"></object>\n<object type=\"application/kenticocloud\" data-type=\"item\" data-codename=\"joel_edgerton\"></object>\n<p>See more in profile of <a data-item-id=\"3294e4b0-e58b-49d7-85fa-5bc9a86556ec\" href=\"\">Joel Edgerton</a> and <a data-item-id=\"d1557cb1-d7ec-4d04-9742-f86b52bc34fc\" href=\"\">Tom Hardy</a></p>
    `;

    var field = new Fields.RichTextField('name', html, modularItems, false,
        {
            richTextResolver: (item: ActorMock) => {
                return `<p class="testing_richtext">${item.firstName.text}</p>`;
            },

        });

    it(`checks name`, () => {
        expect(field.name).toEqual('name');
    });

    it(`checks value`, () => {
        expect(field.value).toEqual(html);
    });

    it(`checks number of modular items`, () => {
        expect(field.modularItems.length).toEqual(2);
    });

    it(`checks that html contains resolved modular content #1`, () => {
        var expectedHtml = `<p class="testing_richtext">Tom</p>`;
        expect(field.getHtml()).toContain(expectedHtml);
    });

    it(`checks that html contains resolved modular content #2`, () => {
        var expectedHtml = `<p class="testing_richtext">Joel</p>`;
        expect(field.getHtml()).toContain(expectedHtml);
    });


    it(`checks that html contains resolved url #1`, () => {
        var expectedHtml = `/actor-rt/tom_hardy`;
        expect(field.getHtml()).toContain(expectedHtml);
    });

    it(`checks that html contains resolved url #2`, () => {
        var expectedHtml = `/actor-rt/joel_edgerton`;
        expect(field.getHtml()).toContain(expectedHtml);
    });

});

