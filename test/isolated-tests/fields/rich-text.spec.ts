// setup
import { setup, Context, Movie, Actor } from '../../setup';

// models
import { DeliveryClientConfig, Fields, ContentItem, ContentItemSystemAttributes, FieldModels, Link, ILink, TypeResolverService, TypeResolver } from '../../../lib';

class ActorMock extends ContentItem {
    firstName: Fields.TextField;
    system: ContentItemSystemAttributes;
    url: Fields.UrlSlugField;

    constructor() {
        super()
    }

    setProperties(id: string, codename: string, firstName: string) {
        this.firstName = new Fields.TextField('firstName', firstName);
        this.system = new ContentItemSystemAttributes(id, 'name', codename, 'actor', null, 'en', []);
        this.url = new Fields.UrlSlugField('url', codename, this, (link: ILink) => {
            return `/actor-rt/` + link.url_slug;
        }, true);
    }
}

// tests
describe('RichTextField', () => {
    // prepare config & type resolver
    const typeResolvers: TypeResolver[] = [
        new TypeResolver('actor', () => new ActorMock())
    ];

    const config: DeliveryClientConfig = new DeliveryClientConfig('fakeId', typeResolvers);

    // prepare type resolver service
    const typeResolverService = new TypeResolverService(config);

    // prepare modular items
    const modularItems: ActorMock[] = [];

    const tomHardyId = 'd1557cb1-d7ec-4d04-9742-f86b52bc34fc';
    const joelEdgertonId = '3294e4b0-e58b-49d7-85fa-5bc9a86556ec';

    const tomHardy = new ActorMock();
    tomHardy.setProperties(tomHardyId, 'tom_hardy', 'Tom');

    const joelEdgerton = new ActorMock();
    joelEdgerton.setProperties(joelEdgertonId, 'joel_edgerton', 'Joel');

    // prepare links
    const links: ILink[] = [
        new Link(tomHardy.system.id, tomHardy.system.codename, tomHardy.system.type, 'slug_for_tom'),
        new Link(joelEdgerton.system.id, joelEdgerton.system.codename, joelEdgerton.system.type, 'slug_for_joel')
    ];

    modularItems.push(tomHardy);
    modularItems.push(joelEdgerton);

    // prepare html
    // tslint:disable:max-line-length
    const html = `
    <p>The youngest son of an alcoholic former boxer returns home, where he's trained by his father for competition in a mixed martial arts tournament - a path that puts the fighter on a collision course with his estranged, older brother.</p>\n<p>Stars:&nbsp;</p>\n<object type=\"application/kenticocloud\" data-type=\"item\" data-codename=\"tom_hardy\"></object>\n<object type=\"application/kenticocloud\" data-type=\"item\" data-codename=\"joel_edgerton\"></object>\n<p>See more in profile of <a data-item-id=\"3294e4b0-e58b-49d7-85fa-5bc9a86556ec\" href=\"\">Joel Edgerton</a> and <a data-item-id=\"d1557cb1-d7ec-4d04-9742-f86b52bc34fc\" href=\"\">Tom Hardy</a></p>
    `;

    const field = new Fields.RichTextField('name', html, modularItems, links, typeResolverService, false,
        {
            richTextResolver: (item: ActorMock) => {
                return `<p class="testing_richtext">${item.firstName.text}</p>`;
            },
            linkResolver: (link: ILink) => '/actor-rt/' + link.url_slug
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
        const expectedHtml = `<p class="testing_richtext">Tom</p>`;
        expect(field.getHtml()).toContain(expectedHtml);
    });

    it(`checks that html contains resolved modular content #2`, () => {
        const expectedHtml = `<p class="testing_richtext">Joel</p>`;
        expect(field.getHtml()).toContain(expectedHtml);
    });

    it(`checks that html contains resolved url #1`, () => {
        const expectedHtml = `/actor-rt/slug_for_tom`;
        expect(field.getHtml()).toContain(expectedHtml);
    });

    it(`checks that html contains resolved url #2`, () => {
        const expectedHtml = `/actor-rt/slug_for_joel`;
        expect(field.getHtml()).toContain(expectedHtml);
    });

    it(`checks that links are resolved even if the rich text resolver is not set`, () => {
        const fieldWithoutRichTextResolver = new Fields.RichTextField('name', html, modularItems, links, typeResolverService, false,
        {
            richTextResolver: null,
            linkResolver: (link: ILink) => '/actor-rt/' + link.url_slug
        });

        const expectedHtml1 = `/actor-rt/slug_for_joel`;
        const expectedHtml2 = `/actor-rt/slug_for_tom`;
        expect(fieldWithoutRichTextResolver.getHtml()).toContain(expectedHtml1);
        expect(fieldWithoutRichTextResolver.getHtml()).toContain(expectedHtml2);
    });
});

