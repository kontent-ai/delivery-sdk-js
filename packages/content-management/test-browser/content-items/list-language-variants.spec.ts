import { ContentItemElements, ContentItemResponses, ReferenceModel, ContentItemModels } from '../../lib';
import * as listLanguageVariantsJson from '../fake-responses/content-items/fake-list-language-variants.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

class ArticleElements extends ContentItemModels.ContentItemVariantElements {

    public title!: ContentItemElements.TextElement;
    public postDate!: ContentItemElements.DateElement;
}

describe('List language variants', () => {
    let response: ContentItemResponses.ListLanguageVariantsResponse<ArticleElements>;

    beforeAll((done) => {
        getTestClientWithJson(listLanguageVariantsJson).listLanguageVariants<ArticleElements>()
            .byCodename('xxx')
            .withFields(() => new ArticleElements(), [{
                name: 'title',
                propertyName: 'title',
                type: ContentItemElements.ContentElementTypeEnum.text
            },
            {
                name: 'post_date',
                propertyName: 'postDate',
                type: ContentItemElements.ContentElementTypeEnum.date
            }])
            .getObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const codenameUrl = cmTestClient.listLanguageVariants().byCodename('xCodename').getUrl();
        const internalIdUrl = cmTestClient.listLanguageVariants().byInternalId('xInternalId').getUrl();
        const externalIdUrl = cmTestClient.listLanguageVariants().byExternalId('xExternalId').getUrl();

        expect(codenameUrl).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/items/codename/xCodename/variants`);
        expect(internalIdUrl).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/items/xInternalId/variants`);
        expect(externalIdUrl).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/items/external-id/xExternalId/variants`);
    });

    it(`response should be instance of ListLanguageVariantsResponse class`, () => {
        expect(response).toEqual(jasmine.any(ContentItemResponses.ListLanguageVariantsResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
        expect(response.data.variants).toBeDefined();
    });

    it(`item basic properties should be mapped`, () => {
        expect(response.data.variants).toBeDefined();
        expect(Array.isArray(response.data.variants)).toBeTruthy();
        expect(response.data.variants.length).toBeGreaterThan(0);

        response.data.variants.forEach(m => {
            expect(m.rawElements).toBeDefined();
            expect(m.item).toBeDefined();
            expect(m.language).toBeDefined();
            expect(m.elements).toBeDefined();
            expect(m.lastModified).toEqual(jasmine.any(Date));

            expect(m.item).toEqual(jasmine.any(ReferenceModel));
            expect(m.language).toEqual(jasmine.any(ReferenceModel));
        });
    });

    it(`elements should be mapped`, () => {
        response.data.variants.forEach(m => {
            // raw elements
            expect(m.rawElements.title).toEqual(m.elements.title.text);
            expect(new Date(m.rawElements.post_date)).toEqual(m.elements.postDate.date || new Date());

            // strongly typed elements
            expect(m.elements).toEqual(jasmine.any(ArticleElements));
            expect(m.elements.title).toEqual(jasmine.any(ContentItemElements.TextElement));
            expect(m.elements.postDate).toEqual(jasmine.any(ContentItemElements.DateElement));
        });
    });

});

