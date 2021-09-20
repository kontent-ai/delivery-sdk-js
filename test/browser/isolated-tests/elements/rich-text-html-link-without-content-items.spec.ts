import {
    BrowserRichTextParser,
    ContentItem,
    Elements,
    ItemUrlSlugResolver,
    Link,
    Parse5RichTextParser,
    richTextResolver,
} from '../../../../lib';

class ActorMockWithUrl extends ContentItem<any> {
    constructor() {
        super({
            urlSlugResolver: (link, context) => {
                return {
                    url: `resolved-url-${link.urlSlug}`
                };
            }
        });
    }
}

class ActorMockWithHtml extends ContentItem<any> {
    constructor() {
        super({
            urlSlugResolver: (link, context) => {
                return {
                    html: `<p>${link.urlSlug}</p>`
                };
            }
        });
    }
}

describe('RichTextElement with Html links only (without content items in response)', () => {
    // prepare links
    const links: Link[] = [
        new Link({
            linkId: 'link-a-id',
            codename: 'link-a-codename',
            type: 'file',
            urlSlug: 'link-a-slug'
        }),
        new Link({
            linkId: 'link-b-id',
            codename: 'link-b-codename',
            type: 'file',
            urlSlug: 'link-b-slug'
        })
    ];

    const beforeLinkText = 'BEFORELINK';
    const afterLinkText = 'AFTERLINK';

    const getLinkedItem: (codename: string) => ContentItem<any> | undefined = codename => undefined;

    const getGlobalUrlSlugResolverWithUrl: (type: string) => ItemUrlSlugResolver | undefined = type => {
        const mockActor = new ActorMockWithUrl();
        if (mockActor._config && mockActor._config.urlSlugResolver) {
            return mockActor._config.urlSlugResolver;
        }
        return undefined;
    };

    const getGlobalUrlSlugResolverWitHtml: (type: string) => ItemUrlSlugResolver | undefined = type => {
        const mockActor = new ActorMockWithHtml();
        if (mockActor._config && mockActor._config.urlSlugResolver && type === 'file') {
            return mockActor._config.urlSlugResolver;
        }
        return undefined;
    };

    // prepare html
    // tslint:disable:max-line-length
    const html = `<h3><strong>Logotypes &amp; Badges</strong></h3>\n<p>${beforeLinkText}<a data-item-id=\"link-a-id\" href=\"\">Link A display text</a>${afterLinkText}</p>\n<p>${beforeLinkText}<a data-item-id=\"link-b-id\" href=\"\">Link B display text</a>${afterLinkText}</p>`;

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
            [],
            {
                links: links,
                resolveRichTextFunc: () =>
                    richTextResolver.resolveData('', html, 'name', {
                        getGlobalUrlSlugResolver: getGlobalUrlSlugResolverWithUrl,
                        links: links,
                        getLinkedItem: getLinkedItem,
                        images: [],
                        richTextHtmlParser: new BrowserRichTextParser(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {}
                    }),
                images: []
            }
        );

        const expectedHtml1 = `${beforeLinkText}<a data-item-id="link-a-id" href="resolved-url-link-a-slug">Link A display text</a>${afterLinkText}`;
        const expectedHtml2 = `${beforeLinkText}<a data-item-id="link-b-id" href="resolved-url-link-b-slug">Link B display text</a>${afterLinkText}`;
        expect(elementWithoutRichTextResolver.resolveHtml()).toContain(expectedHtml1);
        expect(elementWithoutRichTextResolver.resolveHtml()).toContain(expectedHtml2);
    });

    it(`checks that links are resolved as HTML (browser)`, () => {
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
            [],
            {
                links: links,
                resolveRichTextFunc: () =>
                    richTextResolver.resolveData('', html, 'name', {
                        getGlobalUrlSlugResolver: getGlobalUrlSlugResolverWitHtml,
                        links: links,
                        getLinkedItem: getLinkedItem,
                        images: [],
                        richTextHtmlParser: new BrowserRichTextParser(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {}
                    }),
                images: []
            }
        );

        const expectedHtml1 = `${beforeLinkText}<p>link-a-slug</p>${afterLinkText}`;
        const expectedHtml2 = `${beforeLinkText}<p>link-b-slug</p>${afterLinkText}`;
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
            [],
            {
                links: links,
                resolveRichTextFunc: () =>
                    richTextResolver.resolveData('', html, 'name', {
                        getGlobalUrlSlugResolver: getGlobalUrlSlugResolverWithUrl,
                        links: links,
                        getLinkedItem: getLinkedItem,
                        images: [],
                        richTextHtmlParser: new Parse5RichTextParser(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {}
                    }),
                images: []
            }
        );

        const expectedHtml1 = `${beforeLinkText}<a data-item-id="link-a-id" href="resolved-url-link-a-slug">Link A display text</a>${afterLinkText}`;
        const expectedHtml2 = `${beforeLinkText}<a data-item-id="link-b-id" href="resolved-url-link-b-slug">Link B display text</a>${afterLinkText}`;
        expect(elementWithoutRichTextResolver.resolveHtml()).toContain(expectedHtml1);
        expect(elementWithoutRichTextResolver.resolveHtml()).toContain(expectedHtml2);
    });

    it(`checks that links are resolved as HTML (parse5)`, () => {
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
            [],
            {
                links: links,
                resolveRichTextFunc: () =>
                    richTextResolver.resolveData('', html, 'name', {
                        getGlobalUrlSlugResolver: getGlobalUrlSlugResolverWitHtml,
                        links: links,
                        getLinkedItem: getLinkedItem,
                        images: [],
                        richTextHtmlParser: new Parse5RichTextParser(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {}
                    }),
                images: []
            }
        );

        const expectedHtml1 = `${beforeLinkText}<p>link-a-slug</p>${afterLinkText}`;
        const expectedHtml2 = `${beforeLinkText}<p>link-b-slug</p>${afterLinkText}`;
        expect(elementWithoutRichTextResolver.resolveHtml()).toContain(expectedHtml1);
        expect(elementWithoutRichTextResolver.resolveHtml()).toContain(expectedHtml2);
    });
});
