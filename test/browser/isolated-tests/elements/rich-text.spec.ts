import {
    ContentItem,
    ContentItemSystemAttributes,
    Elements,
    getParserAdapter,
    IRichTextResolverContext,
    ItemUrlSlugResolver,
    Link,
    RichTextItemDataType,
    richTextResolver,
    urlSlugResolver,
    BrowserRichTextParser,
    Parse5RichTextParser,
    IContentItemElements
} from '../../../../lib';

interface ActorMockElements extends IContentItemElements {
    firstName: Elements.TextElement;
    url: Elements.UrlSlugElement;
}

class ActorMock extends ContentItem<ActorMockElements> {
    constructor() {
        super();
        this.elements = {} as any;
    }

    setProperties(id: string, codename: string, firstName: string) {
        this.elements.firstName = new Elements.TextElement({
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
            lastModified: new Date(),
            workflowStep: 'published'
        });

        this.elements.url = new Elements.UrlSlugElement(
            {
                contentItemSystem: {} as any,
                propertyName: 'urlSlugName',
                rawElement: {
                    name: 'name',
                    value: codename,
                    type: ''
                }
            },
            {
                resolveLinkFunc: () =>
                    urlSlugResolver.resolveUrl({
                        elementName: 'name',
                        item: this,
                        elementValue: codename,
                        resolver: (link, context) => {
                            return {
                                url: `/actor-rt/` + link.urlSlug
                            };
                        }
                    }).url || ''
            }
        );
    }
}

describe('RichTextElement', () => {
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

    const getLinkedItem: (codename: string) => ContentItem<any> | undefined = (codename) =>
        linkedItems.find((m) => m.system.codename === codename);

    const getGlobalUrlSlugResolver: (type: string) => ItemUrlSlugResolver | undefined = (type) => {
        const mockActor = new ActorMock();
        if (mockActor._config && mockActor._config.urlSlugResolver) {
            return mockActor._config.urlSlugResolver;
        }
        return undefined;
    };

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

    const element = new Elements.RichTextElement(
        {
            contentItemSystem: {} as any,
            propertyName: 'resolvedName',
            rawElement: {
                name: 'name',
                value: html,
                type: ''
            }
        },
        linkedItems.map((m) => m.system.codename),
        {
            links: links,
            resolveRichTextFunc: () =>
                richTextResolver.resolveData('', html, 'name', {
                    getGlobalUrlSlugResolver: getGlobalUrlSlugResolver,
                    links: links,
                    getLinkedItem: getLinkedItem,
                    images: [],
                    richTextHtmlParser: getParserAdapter(),
                    linkedItemWrapperClasses: ['kc-wrapper-class'],
                    linkedItemWrapperTag: 'kcelem',
                    queryConfig: {
                        richTextResolver: (item, context) => {
                            return `<p class="testing_richtext">${(<ActorMock>item).elements.firstName.value}</p>`;
                        },
                        urlSlugResolver: (link, context) => {
                            return {
                                url: '/actor-rt/' + link.urlSlug
                            };
                        }
                    }
                }),
            images: []
        }
    );

    it(`checks name`, () => {
        expect(element.name).toEqual('name');
    });

    it(`value should be original (unresolved) html`, () => {
        expect(element.value).toEqual(html);
    });

    it(`checks that linkedItemCodenames element is mapped`, () => {
        expect(element.linkedItemCodenames).toBeDefined();
    });

    it(`checks that html contains resolved linked item content #1`, () => {
        const expectedHtml = `<p class="testing_richtext">Tom</p>`;
        expect(element.resolveHtml()).toContain(expectedHtml);
    });

    it(`checks that html contains resolved linked item content #2`, () => {
        const expectedHtml = `<p class="testing_richtext">Joel</p>`;
        expect(element.resolveHtml()).toContain(expectedHtml);
    });

    it(`checks that html contains resolved url #1`, () => {
        const expectedHtml = `/actor-rt/slug_for_tom`;
        expect(element.resolveHtml()).toContain(expectedHtml);
    });

    it(`checks that html contains resolved url #2`, () => {
        const expectedHtml = `/actor-rt/slug_for_joel`;
        expect(element.resolveHtml()).toContain(expectedHtml);
    });

    it(`checks that html contains propper linked item wrapper`, () => {
        const elem = `kcelem`;
        expect(element.resolveHtml()).toContain(elem);
    });

    it(`checks that html contains propper linked item class`, () => {
        const wrapperClass = `kc-wrapper-class`;
        expect(element.resolveHtml()).toContain(wrapperClass);
    });

    it(`checks that links are present in rich text element`, () => {
        expect(element.links.length).toEqual(links.length);
    });

    it(`checks that links are resolved even if the rich text resolver is not set (browser)`, () => {
        const elementWithoutRichTextResolver = new Elements.RichTextElement(
            {
                contentItemSystem: {} as any,
                propertyName: 'x',
                rawElement: {
                    name: '',
                    value: html,
                    type: ''
                }
            },
            linkedItems.map((m) => m.system.codename),
            {
                links: links,
                resolveRichTextFunc: () =>
                    richTextResolver.resolveData('', html, 'name', {
                        getGlobalUrlSlugResolver: getGlobalUrlSlugResolver,
                        links: links,
                        getLinkedItem: getLinkedItem,
                        images: [],
                        richTextHtmlParser: new BrowserRichTextParser(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {
                            richTextResolver: undefined,
                            urlSlugResolver: (link, context) => {
                                return {
                                    url: '/actor-rt/' + link.urlSlug
                                };
                            }
                        }
                    }),
                images: []
            }
        );

        const expectedHtml1 = `href="/actor-rt/slug_for_joel"`;
        const expectedHtml2 = `href="/actor-rt/slug_for_tom"`;
        expect(elementWithoutRichTextResolver.resolveHtml()).toContain(expectedHtml1);
        expect(elementWithoutRichTextResolver.resolveHtml()).toContain(expectedHtml2);
    });

    it(`checks that rich text context is set (browser)`, () => {
        const contexts: IRichTextResolverContext[] = [];

        const elementWithRichTextResolver = new Elements.RichTextElement(
            {
                contentItemSystem: {} as any,
                propertyName: 'x',
                rawElement: {
                    name: '',
                    value: html,
                    type: ''
                }
            },
            linkedItems.map((m) => m.system.codename),
            {
                links: links,
                resolveRichTextFunc: () =>
                    richTextResolver.resolveData('', html, 'name', {
                        getGlobalUrlSlugResolver: getGlobalUrlSlugResolver,
                        links: links,
                        getLinkedItem: getLinkedItem,
                        images: [],
                        richTextHtmlParser: new BrowserRichTextParser(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {
                            richTextResolver: (item, context) => {
                                contexts.push(context);
                                return '';
                            }
                        }
                    }),
                images: []
            }
        );

        elementWithRichTextResolver.resolveHtml();

        expect(contexts).toBeDefined();
        expect(contexts.length).toEqual(2);
        expect(contexts.filter((m) => m.contentType === RichTextItemDataType.Item).length).toEqual(2);
    });

    it(`error should be preserved when it originates from richTextResolver (browser)`, () => {
        const elementWithRichTextResolver = new Elements.RichTextElement(
            {
                contentItemSystem: {} as any,
                propertyName: 'x',
                rawElement: {
                    name: '',
                    value: html,
                    type: ''
                }
            },
            linkedItems.map((m) => m.system.codename),
            {
                links: links,
                resolveRichTextFunc: () =>
                    richTextResolver.resolveData('', html, 'name', {
                        getGlobalUrlSlugResolver: getGlobalUrlSlugResolver,
                        links: links,
                        getLinkedItem: getLinkedItem,
                        images: [],
                        richTextHtmlParser: new BrowserRichTextParser(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {
                            richTextResolver: (item, context) => {
                                throw Error(`Custom processing error`);
                            }
                        }
                    }),
                images: []
            }
        );

        expect(() => elementWithRichTextResolver.resolveHtml()).toThrowError('Custom processing error');
    });

    it(`checks that links are resolved even if the rich text resolver is not set (parse5)`, () => {
        const elementWithoutRichTextResolver = new Elements.RichTextElement(
            {
                contentItemSystem: {} as any,
                propertyName: 'x',
                rawElement: {
                    name: '',
                    value: html,
                    type: ''
                }
            },
            linkedItems.map((m) => m.system.codename),
            {
                links: links,
                resolveRichTextFunc: () =>
                    richTextResolver.resolveData('', html, 'name', {
                        getGlobalUrlSlugResolver: getGlobalUrlSlugResolver,
                        links: links,
                        getLinkedItem: getLinkedItem,
                        images: [],
                        richTextHtmlParser: new Parse5RichTextParser(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {
                            richTextResolver: undefined,
                            urlSlugResolver: (link, context) => {
                                return {
                                    url: '/actor-rt/' + link.urlSlug
                                };
                            }
                        }
                    }),
                images: []
            }
        );

        const resolvedHtml = elementWithoutRichTextResolver.resolveHtml();

        const expectedHtml1 = `href="/actor-rt/slug_for_joel"`;
        const expectedHtml2 = `href="/actor-rt/slug_for_tom"`;
        expect(resolvedHtml).toContain(expectedHtml1);
        expect(resolvedHtml).toContain(expectedHtml2);
    });

    it(`chceks that linked item index is set (parse5)`, () => {
        const elementWithoutRichTextResolver = new Elements.RichTextElement(
            {
                contentItemSystem: {} as any,
                propertyName: 'x',
                rawElement: {
                    name: '',
                    value: html,
                    type: ''
                }
            },
            linkedItems.map((m) => m.system.codename),
            {
                links: links,
                resolveRichTextFunc: () =>
                    richTextResolver.resolveData('', html, 'name', {
                        getGlobalUrlSlugResolver: getGlobalUrlSlugResolver,
                        links: links,
                        getLinkedItem: getLinkedItem,
                        images: [],
                        richTextHtmlParser: new Parse5RichTextParser(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {
                            richTextResolver: undefined,
                            urlSlugResolver: (link, context) => {
                                return {
                                    url: '/actor-rt/' + link.urlSlug
                                };
                            }
                        }
                    }),
                images: []
            }
        );

        const resolvedHtml = elementWithoutRichTextResolver.resolveHtml();

        const expectedLinkedItemIndexAttributes: string[] = ['data-sdk-item-index="0"', 'data-sdk-item-index="1"'];

        for (const attr of expectedLinkedItemIndexAttributes) {
            expect(resolvedHtml).toContain(attr);
        }
    });

    it(`chceks that linked item index is set (parse5)`, () => {
        const elementWithoutRichTextResolver = new Elements.RichTextElement(
            {
                contentItemSystem: {} as any,
                propertyName: 'x',
                rawElement: {
                    name: '',
                    value: html,
                    type: ''
                }
            },
            linkedItems.map((m) => m.system.codename),
            {
                links: links,
                resolveRichTextFunc: () =>
                    richTextResolver.resolveData('', html, 'name', {
                        getGlobalUrlSlugResolver: getGlobalUrlSlugResolver,
                        links: links,
                        getLinkedItem: getLinkedItem,
                        images: [],
                        richTextHtmlParser: new BrowserRichTextParser(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {
                            richTextResolver: undefined,
                            urlSlugResolver: (link, context) => {
                                return {
                                    url: '/actor-rt/' + link.urlSlug
                                };
                            }
                        }
                    }),
                images: []
            }
        );

        const resolvedHtml = elementWithoutRichTextResolver.resolveHtml();

        const expectedLinkedItemIndexAttributes: string[] = ['data-sdk-item-index="0"', 'data-sdk-item-index="1"'];

        for (const attr of expectedLinkedItemIndexAttributes) {
            expect(resolvedHtml).toContain(attr);
        }
    });

    it(`checks that rich text context is set (parse5)`, () => {
        const contexts: IRichTextResolverContext[] = [];

        const elementWithRichTextResolver = new Elements.RichTextElement(
            {
                contentItemSystem: {} as any,
                propertyName: 'x',
                rawElement: {
                    name: '',
                    value: html,
                    type: ''
                }
            },
            linkedItems.map((m) => m.system.codename),
            {
                links: links,
                resolveRichTextFunc: () =>
                    richTextResolver.resolveData('', html, 'name', {
                        getGlobalUrlSlugResolver: getGlobalUrlSlugResolver,
                        links: links,
                        getLinkedItem: getLinkedItem,
                        images: [],
                        richTextHtmlParser: new Parse5RichTextParser(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {
                            richTextResolver: (item, context) => {
                                contexts.push(context);
                                return '';
                            }
                        }
                    }),
                images: []
            }
        );

        elementWithRichTextResolver.resolveHtml();

        expect(contexts).toBeDefined();
        expect(contexts.length).toEqual(2);
        expect(contexts.filter((m) => m.contentType === RichTextItemDataType.Item).length).toEqual(2);
    });

    it(`error should be preserved when it originates from richTextResolver (parse5)`, () => {
        const elementWithRichTextResolver = new Elements.RichTextElement(
            {
                contentItemSystem: {} as any,
                propertyName: 'x',
                rawElement: {
                    name: '',
                    value: html,
                    type: ''
                }
            },
            linkedItems.map((m) => m.system.codename),
            {
                links: links,
                resolveRichTextFunc: () =>
                    richTextResolver.resolveData('', html, 'name', {
                        getGlobalUrlSlugResolver: getGlobalUrlSlugResolver,
                        links: links,
                        getLinkedItem: getLinkedItem,
                        images: [],
                        richTextHtmlParser: new Parse5RichTextParser(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {
                            richTextResolver: (item, context) => {
                                throw Error(`Custom processing error`);
                            }
                        }
                    }),
                images: []
            }
        );

        expect(() => elementWithRichTextResolver.resolveHtml()).toThrowError('Custom processing error');
    });
});
