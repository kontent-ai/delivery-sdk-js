import { ContentItem, Elements, IUrlSlugResolverResult, richTextResolver, ItemUrlSlugResolver, BrowserRichTextParser } from '../../../../lib';
import { Parse5RichTextParser } from '../../../../lib/parser/adapters/parse5-rich-text.parser';

describe('Rich text with regular link', () => {
    const linkedItems: ContentItem[] = [];
    const getLinkedItem: (codename: string) => ContentItem | undefined = codename =>
        linkedItems.find(m => m.system.codename === codename);
    const getGlobalUrlSlugResolver: (type: string) => ItemUrlSlugResolver | undefined = type => undefined;

    const html = `Text with <a href="domain.com">link</a>`;

    it(`Resolving HTML should succeed (parse5)`, () => {
        const element = new Elements.RichTextElement(
            {
                rawElement: {
                    name: 'name',
                    taxonomy_group: undefined,
                    type: 'x',
                    value: html
                },
                contentItemSystem: {} as any,
                propertyName: 'name'
            },
            linkedItems.map(m => m.system.codename),
            {
                links: [],
                resolveRichTextFunc: () =>
                    richTextResolver.resolveData('', html, 'name', {
                        enableAdvancedLogging: false,
                        getGlobalUrlSlugResolver: getGlobalUrlSlugResolver,
                        links: [],
                        getLinkedItem: getLinkedItem,
                        images: [],
                        richTextHtmlParser: new Parse5RichTextParser(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {
                            richTextResolver: undefined as any,
                            urlSlugResolver: link =>
                                <IUrlSlugResolverResult>{
                                    html: `<test>${link.urlSlug}</test>`
                                }
                        }
                    }),
                images: []
            }
        );

        const expectedHtml = `Text with <a href="domain.com">link</a>`;
        expect(element.resolveHtml()).toContain(expectedHtml);
    });

    it(`Resolving HTML should succeed (browser)`, () => {
        const element = new Elements.RichTextElement({
            rawElement: {
                name: 'name',
                taxonomy_group: undefined,
                type: 'x',
                value: html
            },
            contentItemSystem: {} as any,
            propertyName: 'name'
        }, linkedItems.map(m => m.system.codename), {
                links: [],
                resolveRichTextFunc: () => richTextResolver.resolveData('', html, 'name', {
                    enableAdvancedLogging: false,
                    getGlobalUrlSlugResolver: getGlobalUrlSlugResolver,
                    links: [],
                    getLinkedItem: getLinkedItem,
                    images: [],
                    richTextHtmlParser: new BrowserRichTextParser(),
                    linkedItemWrapperClasses: ['kc-wrapper-class'],
                    linkedItemWrapperTag: 'kc-item-wrapper',
                    queryConfig: {
                        richTextResolver: undefined as any,
                        urlSlugResolver: (link) => <IUrlSlugResolverResult>{
                            html: `<test>${link.urlSlug}</test>`,
                        }
                    },
                }),
                images: []
            });

        const expectedHtml = `Text with <a href="domain.com">link</a>`;
        expect(element.resolveHtml()).toContain(expectedHtml);
    });
});
