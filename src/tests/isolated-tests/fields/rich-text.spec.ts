// setup
import { setup, Context, Movie, Actor } from '../../setup';

// models
import {
    RichTextField, TextField, ContentItem, ContentItemSystemAttributes
} from '../../../../lib';

class ActorMock extends ContentItem {
    firstName: TextField;
    system: ContentItemSystemAttributes;

    constructor(codename: string, firstName: string) {
        super()
        this.firstName = new TextField('firstName', firstName);
        this.system = new ContentItemSystemAttributes('id', 'name', codename, 'actor', null, 'en');
    }
}

// tests
describe('RichTextField', () => {

    // prepare modular items
    var modularItems: ActorMock[] = [];

    var tomHardy = new ActorMock('tom_hardy', 'Tom');
    var joelEdgerton = new ActorMock('joel_edgerton', 'Joel');

    modularItems.push(tomHardy);
    modularItems.push(joelEdgerton);

    // prepare html
    var html = `
    <h1>Test</h1><object type=\"application/kenticocloud\" data-type=\"item\" data-codename=\"tom_hardy\"></object><object type=\"application/kenticocloud\" data-type=\"item\" data-codename=\"joel_edgerton\"></object>
    `;

    var field = new RichTextField('name', html, modularItems, false,
        (item: ActorMock) => {
            return `<p>${item.firstName.text}</p>`;
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

    it(`checks that html is resolved correctly`, () => {

        var expectedHtml = `
        <h1>Test</h1><div type="application/kenticocloud" data-type="item" data-codename="tom_hardy"><p>Tom</p></div><div type="application/kenticocloud" data-type="item" data-codename="joel_edgerton"><p>Joel</p></div>
        `;

        expect(field.getHtml().trim()).toEqual(expectedHtml.trim());
    });
});

