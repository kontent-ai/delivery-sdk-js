import {
    ContentItem,
    ContentItemSystemAttributes,
    Fields,
    IDeliveryClientConfig,
    Link,
    richTextResolver,
    TypeResolver,
    urlSlugResolver,
    getParserAdapter,
    IRichTextResolverContext
} from '../../../lib';
import { RichTextContentType } from '../../../lib/enums';

class ActorMock extends ContentItem {
    firstName!: Fields.TextField;
    system!: ContentItemSystemAttributes;
    url!: Fields.UrlSlugField;

    constructor() {
        super();
    }

    setProperties(id: string, codename: string, firstName: string) {
        this.firstName = new Fields.TextField('firstName', firstName);
        this.system = new ContentItemSystemAttributes({
            id: id,
            name: 'name',
            codename: codename,
            type: 'actor',
            sitemapLocations: [],
            language: 'en',
            lastModified: new Date()
        });

        this.url = new Fields.UrlSlugField('name', codename, {
            resolveLink: () => urlSlugResolver.resolveUrl({
                fieldName: 'name',
                type: 'type',
                item: this,
                linkResolver: (link: Link) => {
                    return `/actor-rt/` + link.urlSlug;
                },
                enableAdvancedLogging: true,
                fieldValue: codename
            })
        });
    }
}

describe('RichTextField', () => {
    // prepare config & type resolver
    const typeResolvers: TypeResolver[] = [
        new TypeResolver('actor', () => new ActorMock())
    ];

    const config: IDeliveryClientConfig = {
        projectId: '',
        typeResolvers: typeResolvers
    };

    // prepare linked items
    const linkedItems: ActorMock[] = [];

    const tomHardyId = 'd1557cb1-d7ec-4d04-9742-f86b52bc34fc';
    const joelEdgertonId = '3294e4b0-e58b-49d7-85fa-5bc9a86556ec';

    const tomHardy = new ActorMock();
    tomHardy.setProperties(tomHardyId, 'tom_hardy', 'Tom');

    const joelEdgerton = new ActorMock();
    joelEdgerton.setProperties(joelEdgertonId, 'joel_edgerton', 'Joel');

    // prepare links
    const links: Link[] = [
        new Link({
            itemId: tomHardy.system.id,
            codename: tomHardy.system.codename,
            type: tomHardy.system.type,
            urlSlug: 'slug_for_tom',
        }),
        new Link({
            itemId: joelEdgerton.system.id,
            codename: joelEdgerton.system.codename,
            type: joelEdgerton.system.type,
            urlSlug: 'slug_for_joel',
        })
    ];

    linkedItems.push(tomHardy);
    linkedItems.push(joelEdgerton);

    const getLinkedItem: (codename: string) => ContentItem | undefined = (codename) => linkedItems.find(m => m.system.codename === codename);

    // prepare html
    // tslint:disable:max-line-length
    const html = `
    <p>The youngest son of an alcoholic former boxer returns home, where he's trained by his father for
    competition in a mixed martial arts tournament - a path that puts the fighter on a collision course
    with his estranged, older brother.</p>\n<p>Stars:&nbsp;</p>\n
    <object type=\"application/kenticocloud\" data-type=\"item\" data-codename=\"tom_hardy\"></object>
    \n<object type=\"application/kenticocloud\" data-type=\"item\" data-codename=\"joel_edgerton\"></object>\n<p>
    See more in profile of <a data-item-id=\"3294e4b0-e58b-49d7-85fa-5bc9a86556ec\" href=\"\">Joel Edgerton</a>
    and <a data-item-id=\"d1557cb1-d7ec-4d04-9742-f86b52bc34fc\" href=\"\">Tom Hardy</a></p>
    `;

    const field = new Fields.RichTextField('name', html, linkedItems.map(m => m.system.codename), {
        links: links,
        resolveHtml: () => richTextResolver.resolveHtml(html, {
            enableAdvancedLogging: false,
            links: links,
            getLinkedItem: getLinkedItem,
            typeResolvers: config.typeResolvers as any,
            richTextHtmlParser: getParserAdapter(),
            linkedItemWrapperClasses: ['kc-wrapper-class'],
            linkedItemWrapperTag: 'kcelem',
            queryConfig: {
                richTextResolver: (item: ContentItem, context) => {
                    return `<p class="testing_richtext">${(<ActorMock>item).firstName.text}</p>`;
                },
                linkResolver: (link: Link) => '/actor-rt/' + link.urlSlug
            },
        })
    });


    it(`checks name`, () => {
        expect(field.name).toEqual('name');
    });

    it(`checks value`, () => {
        expect(field.value).toEqual(html);
    });

    it(`checks that linkedItemCodenames field is mapped`, () => {
        expect(field.linkedItemCodenames).toBeDefined();
    });

    it(`checks that html contains resolved linked item content #1`, () => {
        const expectedHtml = `<p class="testing_richtext">Tom</p>`;
        expect(field.getHtml()).toContain(expectedHtml);
    });

    it(`checks that html contains resolved linked item content #2`, () => {
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

    it(`checks that html contains propper linked item wrapper`, () => {
        const elem = `kcelem`;
        expect(field.getHtml()).toContain(elem);
    });

    it(`checks that html contains propper linked item class`, () => {
        const wrapperClass = `kc-wrapper-class`;
        expect(field.getHtml()).toContain(wrapperClass);
    });

    it(`checks that links are present in rich text field`, () => {
        expect(field.links.length).toEqual(links.length);
    });

    it(`checks that links are resolved even if the rich text resolver is not set`, () => {

        const fieldWithoutRichTextResolver = new Fields.RichTextField('name', html, linkedItems.map(m => m.system.codename), {
            links: links,
            resolveHtml: () => richTextResolver.resolveHtml(html, {
                enableAdvancedLogging: false,
                links: links,
                getLinkedItem: getLinkedItem,
                typeResolvers: config.typeResolvers as any,
                richTextHtmlParser: getParserAdapter(),
                linkedItemWrapperClasses: ['kc-wrapper-class'],
                linkedItemWrapperTag: 'kc-item-wrapper',
                queryConfig: {
                    richTextResolver: undefined as any,
                    linkResolver: (link: Link) => '/actor-rt/' + link.urlSlug
                },
            })
        });

        const expectedHtml1 = `href="/actor-rt/slug_for_joel"`;
        const expectedHtml2 = `href="/actor-rt/slug_for_tom"`;
        expect(fieldWithoutRichTextResolver.getHtml()).toContain(expectedHtml1);
        expect(fieldWithoutRichTextResolver.getHtml()).toContain(expectedHtml2);
    });

    it(`checks that rich text context is set`, () => {
        const contexts: IRichTextResolverContext[] = [];

        const fieldWithRichTextResolver = new Fields.RichTextField('name', html, linkedItems.map(m => m.system.codename), {
            links: links,
            resolveHtml: () => richTextResolver.resolveHtml(html, {
                enableAdvancedLogging: false,
                links: links,
                getLinkedItem: getLinkedItem,
                typeResolvers: config.typeResolvers as any,
                richTextHtmlParser: getParserAdapter(),
                linkedItemWrapperClasses: ['kc-wrapper-class'],
                linkedItemWrapperTag: 'kc-item-wrapper',
                queryConfig: {
                    richTextResolver: (item, context) => {
                        contexts.push(context);
                        return '';
                    }
                },
            })
        });

        const result = fieldWithRichTextResolver.getHtml();

        expect(contexts).toBeDefined();
        expect(contexts.length).toEqual(2);
        expect(contexts.filter(m => m.contentType === RichTextContentType.Item).length).toEqual(2);
    });
});

