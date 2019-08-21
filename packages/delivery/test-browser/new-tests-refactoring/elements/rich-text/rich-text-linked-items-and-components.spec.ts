import { Elements, getParserAdapter, IUrlSlugResolverResult, richTextResolver } from '../../../../lib';

describe('Rich text linked items and components', () => {
    // tslint:disable-next-line: max-line-length
    const html = `<p>The youngest son of an alcoholic former boxer returns home, where he's trained by his father for competition in a mixed martial arts tournament - a path that puts the fighter on a collision course with his estranged, older brother.</p>\n<p>Stars:&nbsp;</p>\n<object type=\"application/kenticocloud\" data-type=\"item\" data-rel=\"link\" data-codename=\"tom_hardy\"></object>\n<object type=\"application/kenticocloud\" data-type=\"item\" data-rel=\"link\" data-codename=\"joel_edgerton\"></object>\n<p><br></p>\n<p>See more in profile of <a data-item-id=\"3294e4b0-e58b-49d7-85fa-5bc9a86556ec\" href=\"\">Joel Edgerton</a> and <a data-item-id=\"d1557cb1-d7ec-4d04-9742-f86b52bc34fc\" href=\"\">Tom Hardy</a></p>\n<p>And here are some images:&nbsp;</p>\n<figure data-asset-id=\"22504ba8-2075-48fa-9d4f-8fce3de1754a\" data-image-id=\"22504ba8-2075-48fa-9d4f-8fce3de1754a\"><img src=\"https://assets-us-01.kc-usercontent.com:443/da5abe9f-fdad-4168-97cd-b3464be2ccb9/22504ba8-2075-48fa-9d4f-8fce3de1754a/warrior.jpg\" data-asset-id=\"22504ba8-2075-48fa-9d4f-8fce3de1754a\" data-image-id=\"22504ba8-2075-48fa-9d4f-8fce3de1754a\" alt=\"\"></figure>\n<figure data-asset-id=\"bb0899cf-2c3a-4e3f-8962-60e5a54fcca5\" data-image-id=\"bb0899cf-2c3a-4e3f-8962-60e5a54fcca5\"><img src=\"https://assets-us-01.kc-usercontent.com:443/da5abe9f-fdad-4168-97cd-b3464be2ccb9/bb0899cf-2c3a-4e3f-8962-60e5a54fcca5/tom_hardy.jpg\" data-asset-id=\"bb0899cf-2c3a-4e3f-8962-60e5a54fcca5\" data-image-id=\"bb0899cf-2c3a-4e3f-8962-60e5a54fcca5\" alt=\"\"></figure>\n<p><br></p>\n<p>Also, why not include content component in the mix?</p>\n<object type=\"application/kenticocloud\" data-type=\"item\" data-rel=\"component\" data-codename=\"ec9813f6_194d_018f_e20c_36855fb6e600\"></object>`;

    it(`Checks that linked items and components are properly mapped`, () => {
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
            }, [],
            {
                links: [],
                resolveRichTextFunc: () =>
                    richTextResolver.resolveHtml('', html, 'name', {
                        enableAdvancedLogging: false,
                        links: [],
                        getLinkedItem: () => undefined,
                        images: [],
                        richTextHtmlParser: getParserAdapter(),
                        linkedItemWrapperClasses: ['kc-wrapper-class'],
                        linkedItemWrapperTag: 'kc-item-wrapper',
                        queryConfig: {
                            throwErrorForMissingLinkedItems: false,
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

        const resolvedData = elementWithoutRichTextResolver.resolveData();

        const expectedLinkedItemCodenames: string[] = ['joel_edgerton', 'tom_hardy'];
        const expectedComponentCodenames: string[] = ['ec9813f6_194d_018f_e20c_36855fb6e600'];

        expect(resolvedData.linkedItemCodenames.length).toEqual(expectedLinkedItemCodenames.length);
        expect(resolvedData.componentCodenames.length).toEqual(expectedComponentCodenames.length);

        for (const expectedCodename of expectedLinkedItemCodenames) {
            expect(resolvedData.linkedItemCodenames).toContain(expectedCodename);
        }

        for (const expectedCodename of expectedComponentCodenames) {
            expect(resolvedData.componentCodenames).toContain(expectedCodename);
        }
    });
});
