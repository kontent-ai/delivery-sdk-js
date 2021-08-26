import {
    ContentItem,
    ContentItemSystemAttributes,
    Elements,
    ItemUrlSlugResolver,
    IUrlSlugResolverResult,
    Link,
    richTextResolver,
    urlSlugResolver,
    BrowserRichTextParser,
    Parse5RichTextParser
} from '../../../../lib';

class ActorMock extends ContentItem {
    firstName!: Elements.TextElement;
    system!: ContentItemSystemAttributes;
    url!: Elements.UrlSlugElement;

    constructor() {
        super();
    }

    setProperties(id: string, codename: string, firstName: string) {
        this.firstName = new Elements.TextElement({
            contentItemSystem: {} as any,
            propertyName: 'firstName',
            rawElement: {
                name: '',
                value: firstName,
                type: ''
            }
        });

        this.system = new ContentItemSystemAttributes({
            id: id,
            name: 'name',
            codename: codename,
            type: 'actor',
            sitemapLocations: [],
            collection: 'default',
            language: 'en',
            lastModified: new Date()
        });

        this.url = new Elements.UrlSlugElement(
            {
                contentItemSystem: {} as any,
                propertyName: 'urlSlugName',
                rawElement: {
                    name: '',
                    value: codename,
                    type: ''
                }
            },
            {
                resolveLinkFunc: () =>
                    urlSlugResolver.resolveUrl({
                        elementName: 'name',
                        item: this,
                        resolver: (link, context) => {
                            return {
                                html: `<test>${link.urlSlug}</test>`
                            };
                        },
                        enableAdvancedLogging: true,
                        elementValue: codename
                    }).html || ''
            }
        );
    }
}

describe('RichTextElement with Html links parse5 basic', () => {
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
            linkId: tomHardy.system.id,
            codename: tomHardy.system.codename,
            type: tomHardy.system.type,
            urlSlug: 'slug_for_tom'
        }),
        new Link({
            linkId: joelEdgerton.system.id,
            codename: joelEdgerton.system.codename,
            type: joelEdgerton.system.type,
            urlSlug: 'slug_for_joel'
        })
    ];

    linkedItems.push(tomHardy);
    linkedItems.push(joelEdgerton);

    const beforeLinkText = 'BEFORELINK';
    const afterLinkText = 'AFTERLINK';

    const getLinkedItem: (codename: string) => ContentItem | undefined = codename =>
        linkedItems.find(m => m.system.codename === codename);

    const getGlobalUrlSlugResolver: (type: string) => ItemUrlSlugResolver | undefined = type => {
        const mockActor = new ActorMock();
        if (mockActor._config && mockActor._config.urlSlugResolver) {
            return mockActor._config.urlSlugResolver;
        }
        return undefined;
    };

    // prepare html
    // tslint:disable:max-line-length
    const html = `
    <p>The youngest son of an alcoholic former boxer returns home, where he's trained by his father for competition in a mixed martial arts tournament - a path that puts the fighter on a collision course with his estranged, older brother.</p>\n<p>Stars:&nbsp;</p>\n<object type=\"application/kenticocloud\" data-type=\"item\" data-codename=\"tom_hardy\"></object>\n<object type=\"application/kenticocloud\" data-type=\"item\" data-codename=\"joel_edgerton\"></object>\n<p>See more in profile of ${beforeLinkText}<a data-item-id=\"3294e4b0-e58b-49d7-85fa-5bc9a86556ec\" href=\"\">Joel Edgerton</a>${afterLinkText} and ${beforeLinkText}<a data-item-id=\"d1557cb1-d7ec-4d04-9742-f86b52bc34fc\" href=\"\">Tom Hardy</a>${afterLinkText}</p>
    `;

    it(`checks that links with attributes are resolved as HTML (parse5)`, () => {
        const elementWithoutRichTextResolver = new Elements.RichTextElement(
            {
                contentItemSystem: {} as any,
                propertyName: 'x',
                rawElement: {
                    name: 'x',
                    type: '',
                    value: html
                }
            },
            linkedItems.map(m => m.system.codename),
            {
                links: links,
                resolveRichTextFunc: () =>
                    richTextResolver.resolveData('', html, 'name', {
                        enableAdvancedLogging: false,
                        getGlobalUrlSlugResolver: getGlobalUrlSlugResolver,
                        links: links,
                        getLinkedItem: getLinkedItem,
                        images: [],
                        richTextHtmlParser: new Parse5RichTextParser(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {
                            richTextResolver: undefined as any,
                            urlSlugResolver: link =>
                                <IUrlSlugResolverResult>{
                                    html: `<test href="${link.type}" download>${link.urlSlug}</test>`
                                }
                        }
                    }),
                images: []
            }
        );

        const expectedHtml1 = `${beforeLinkText}<test href="actor" download="">slug_for_joel</test>${afterLinkText}`;
        const expectedHtml2 = `${beforeLinkText}<test href="actor" download="">slug_for_tom</test>${afterLinkText}`;
        expect(elementWithoutRichTextResolver.resolveHtml()).toContain(expectedHtml1);
        expect(elementWithoutRichTextResolver.resolveHtml()).toContain(expectedHtml2);
    });

    it(`checks that links are resolved as link url (parse5)`, () => {
        const elementWithoutRichTextResolver = new Elements.RichTextElement(
            {
                contentItemSystem: {} as any,
                propertyName: 'x',
                rawElement: {
                    name: 'x',
                    type: '',
                    value: html
                }
            },
            linkedItems.map(m => m.system.codename),
            {
                links: links,
                resolveRichTextFunc: () =>
                    richTextResolver.resolveData('', html, 'name', {
                        enableAdvancedLogging: false,
                        getGlobalUrlSlugResolver: getGlobalUrlSlugResolver,
                        links: links,
                        getLinkedItem: getLinkedItem,
                        images: [],
                        richTextHtmlParser: new Parse5RichTextParser(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {
                            richTextResolver: undefined as any,
                            urlSlugResolver: link =>
                                <IUrlSlugResolverResult>{
                                    url: `${link.urlSlug}`
                                }
                        }
                    }),
                images: []
            }
        );

        const expectedHtml1 = `${beforeLinkText}<a data-item-id="3294e4b0-e58b-49d7-85fa-5bc9a86556ec" href="slug_for_joel">Joel Edgerton</a>${afterLinkText}`;
        const expectedHtml2 = `${beforeLinkText}<a data-item-id="d1557cb1-d7ec-4d04-9742-f86b52bc34fc" href="slug_for_tom">Tom Hardy</a>${afterLinkText}`;
        expect(elementWithoutRichTextResolver.resolveHtml()).toContain(expectedHtml1);
        expect(elementWithoutRichTextResolver.resolveHtml()).toContain(expectedHtml2);
    });

    it(`verifies that only a single top tag is allowed for parse5`, () => {
        const elementWithoutRichTextResolver = new Elements.RichTextElement(
            {
                contentItemSystem: {} as any,
                propertyName: 'x',
                rawElement: {
                    name: 'x',
                    type: '',
                    value: html
                }
            },
            linkedItems.map(m => m.system.codename),
            {
                links: links,
                resolveRichTextFunc: () =>
                    richTextResolver.resolveData('', html, 'name', {
                        enableAdvancedLogging: false,
                        getGlobalUrlSlugResolver: (type) => undefined,
                        links: links,
                        getLinkedItem: getLinkedItem,
                        images: [],
                        richTextHtmlParser: new Parse5RichTextParser(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {
                            richTextResolver: undefined as any,
                            urlSlugResolver: link =>
                                <IUrlSlugResolverResult>{
                                    html: `<span>${link.urlSlug}<span><span>data</span>`
                                }
                        }
                    }),
                images: []
            }
        );

        expect(() => elementWithoutRichTextResolver.resolveHtml()).toThrowError();
    });

    it(`checks that links with attributes are resolved as HTML (browser)`, () => {
        const elementWithoutRichTextResolver = new Elements.RichTextElement(
            {
                contentItemSystem: {} as any,
                propertyName: 'x',
                rawElement: {
                    name: 'x',
                    type: '',
                    value: html
                }
            },
            linkedItems.map(m => m.system.codename),
            {
                links: links,
                resolveRichTextFunc: () =>
                    richTextResolver.resolveData('', html, 'name', {
                        enableAdvancedLogging: false,
                        getGlobalUrlSlugResolver: getGlobalUrlSlugResolver,
                        links: links,
                        getLinkedItem: getLinkedItem,
                        images: [],
                        richTextHtmlParser: new BrowserRichTextParser(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {
                            richTextResolver: undefined as any,
                            urlSlugResolver: link =>
                                <IUrlSlugResolverResult>{
                                    html: `<test href="${link.type}" download>${link.urlSlug}</test>`
                                }
                        }
                    }),
                images: []
            }
        );

        const expectedHtml1 = `${beforeLinkText}<test href="actor" download="">slug_for_joel</test>${afterLinkText}`;
        const expectedHtml2 = `${beforeLinkText}<test href="actor" download="">slug_for_tom</test>${afterLinkText}`;
        expect(elementWithoutRichTextResolver.resolveHtml()).toContain(expectedHtml1);
        expect(elementWithoutRichTextResolver.resolveHtml()).toContain(expectedHtml2);
    });

    it(`checks that links are resolved as link url (browser)`, () => {
        const elementWithoutRichTextResolver = new Elements.RichTextElement(
            {
                contentItemSystem: {} as any,
                propertyName: 'x',
                rawElement: {
                    name: 'x',
                    type: '',
                    value: html
                }
            },
            linkedItems.map(m => m.system.codename),
            {
                links: links,
                resolveRichTextFunc: () =>
                    richTextResolver.resolveData('', html, 'name', {
                        enableAdvancedLogging: false,
                        getGlobalUrlSlugResolver: getGlobalUrlSlugResolver,
                        links: links,
                        getLinkedItem: getLinkedItem,
                        images: [],
                        richTextHtmlParser: new BrowserRichTextParser(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {
                            richTextResolver: undefined as any,
                            urlSlugResolver: link =>
                                <IUrlSlugResolverResult>{
                                    url: `${link.urlSlug}`
                                }
                        }
                    }),
                images: []
            }
        );

        const expectedHtml1 = `${beforeLinkText}<a data-item-id="3294e4b0-e58b-49d7-85fa-5bc9a86556ec" href="slug_for_joel">Joel Edgerton</a>${afterLinkText}`;
        const expectedHtml2 = `${beforeLinkText}<a data-item-id="d1557cb1-d7ec-4d04-9742-f86b52bc34fc" href="slug_for_tom">Tom Hardy</a>${afterLinkText}`;
        expect(elementWithoutRichTextResolver.resolveHtml()).toContain(expectedHtml1);
        expect(elementWithoutRichTextResolver.resolveHtml()).toContain(expectedHtml2);
    });
});
