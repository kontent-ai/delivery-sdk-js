import { ContentItem, Elements, richTextResolver, ItemUrlSlugResolver } from '../../../../lib';
import { Parse5RichTextParser } from '../../../../lib/parser/adapters/parse5-rich-text.parser';

describe('Rich text with invalid item data type parse5', () => {
    const linkedItems: ContentItem[] = [];
    const getLinkedItem: (codename: string) => ContentItem | undefined = codename =>
        linkedItems.find(m => m.system.codename === codename);
        const getGlobalUrlSlugResolver: (type: string) => ItemUrlSlugResolver | undefined = type => undefined;

    // tslint:disable-next-line: max-line-length
    const html = `<p>The youngest son of an alcoholic former boxer returns home, where he's trained by his father for competition in a mixed martial arts tournament - a path that puts the fighter on a collision course with his estranged, older brother.</p>\n<p>Stars:&nbsp;</p>\n<object type=\"application/kenticocloud\" data-type=\"unknown_type\" data-rel=\"link\" data-codename=\"tom_hardy\"></object>\n<object type=\"application/kenticocloud\" data-type=\"invalid_type\" data-rel=\"link\" data-codename=\"joel_edgerton\"></object>\n<p><br></p>\n<p>See more in profile of <a data-item-id=\"3294e4b0-e58b-49d7-85fa-5bc9a86556ec\" href=\"\">Joel Edgerton</a> and <a data-item-id=\"d1557cb1-d7ec-4d04-9742-f86b52bc34fc\" href=\"\">Tom Hardy</a></p>\n<p>And here are some images:&nbsp;</p>\n<figure data-asset-id=\"22504ba8-2075-48fa-9d4f-8fce3de1754a\" data-image-id=\"22504ba8-2075-48fa-9d4f-8fce3de1754a\"><img src=\"https://assets-us-01.kc-usercontent.com:443/da5abe9f-fdad-4168-97cd-b3464be2ccb9/22504ba8-2075-48fa-9d4f-8fce3de1754a/warrior.jpg\" data-asset-id=\"22504ba8-2075-48fa-9d4f-8fce3de1754a\" data-image-id=\"22504ba8-2075-48fa-9d4f-8fce3de1754a\" alt=\"\"></figure>\n<figure data-asset-id=\"bb0899cf-2c3a-4e3f-8962-60e5a54fcca5\" data-image-id=\"bb0899cf-2c3a-4e3f-8962-60e5a54fcca5\"><img src=\"https://assets-us-01.kc-usercontent.com:443/da5abe9f-fdad-4168-97cd-b3464be2ccb9/bb0899cf-2c3a-4e3f-8962-60e5a54fcca5/tom_hardy.jpg\" data-asset-id=\"bb0899cf-2c3a-4e3f-8962-60e5a54fcca5\" data-image-id=\"bb0899cf-2c3a-4e3f-8962-60e5a54fcca5\" alt=\"\"></figure>\n<p><br></p>\n<p>Also, why not include content component in the mix?</p>\n<object type=\"application/kenticocloud\" data-type=\"item\" data-rel=\"component\" data-codename=\"ec9813f6_194d_018f_e20c_36855fb6e600\"></object>
    `;

    it(`Resolving HTML should not throw exception when unknown item data type is used`, () => {
        const elementWithoutRichTextResolver = new Elements.RichTextElement(
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
                        getGlobalUrlSlugResolver: getGlobalUrlSlugResolver,
                        enableAdvancedLogging: false,
                        links: [],
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
        expect(() => elementWithoutRichTextResolver.resolveHtml()).not.toThrowError();

        const result = elementWithoutRichTextResolver.resolveData();
        expect(result.linkedItemCodenames.length).toEqual(0);
        expect(result.componentCodenames).toContain('ec9813f6_194d_018f_e20c_36855fb6e600');
    });
});
