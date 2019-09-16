import { ElementModels, LanguageVariantResponses, SharedModels } from '../../lib';
import * as jsonResponse from '../fake-responses/language-variants/fake-upsert-language-variant.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';


describe('View language variant', () => {
    let response: LanguageVariantResponses.ViewLanguageVariantResponse;

    beforeAll((done) => {
        getTestClientWithJson(jsonResponse).viewLanguageVariant()
            .byItemCodename('x')
            .byLanguageCodename('x')
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const codenameUrlWithCodenameLanguage = cmTestClient.viewLanguageVariant().byItemCodename('xCodename').byLanguageCodename('xLanguageCodename').getUrl();
        const internalIdUrlWithCodenameLanguage = cmTestClient.viewLanguageVariant().byItemId('xItemId').byLanguageCodename('xLanguageCodename').getUrl();
        const externalIdUrlWithCodenameLanguage = cmTestClient.viewLanguageVariant().byItemExternalId('XItemExternal').byLanguageCodename('xLanguageCodename').getUrl();

        const codenameUrlWithIdLanguage = cmTestClient.viewLanguageVariant().byItemCodename('xCodename').byLanguageId('xLanguageId').getUrl();
        const internalIdUrlWithIdLanguage = cmTestClient.viewLanguageVariant().byItemId('xItemId').byLanguageId('xLanguageId').getUrl();
        const externalIdUrlWithIdLanguage = cmTestClient.viewLanguageVariant().byItemExternalId('XItemExternal').byLanguageId('xLanguageId').getUrl();

        expect(codenameUrlWithCodenameLanguage).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/items/codename/xCodename/variants/codename/xLanguageCodename`);
        expect(internalIdUrlWithCodenameLanguage).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/items/xItemId/variants/codename/xLanguageCodename`);
        expect(externalIdUrlWithCodenameLanguage).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/items/external-id/XItemExternal/variants/codename/xLanguageCodename`);

        expect(codenameUrlWithIdLanguage).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/items/codename/xCodename/variants/xLanguageId`);
        expect(internalIdUrlWithIdLanguage).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/items/xItemId/variants/xLanguageId`);
        expect(externalIdUrlWithIdLanguage).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/items/external-id/XItemExternal/variants/xLanguageId`);
    });

    it(`response should be instance of ViewLanguageVariantResponse class`, () => {
        expect(response).toEqual(jasmine.any(LanguageVariantResponses.ViewLanguageVariantResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
        expect(response.data.elements).toBeDefined();
        expect(response.data.item).toBeDefined();
        expect(response.data.language).toBeDefined();
        expect(response.data.lastModified).toBeDefined();
    });

    it(`item properties should be mapped`, () => {
        const variant = response.data;
        const originalItem = jsonResponse;

        if (!originalItem) {
            throw Error(`Could not find original item with id '${variant.item.id}'`);
        }

        expect(variant.item).toBeDefined();
        expect(variant.language).toBeDefined();
        expect(variant.elements).toBeDefined();
        expect(variant.lastModified).toEqual(jasmine.any(Date));

        expect(variant.item).toEqual(jasmine.any(SharedModels.ReferenceObject));
        expect(variant.language).toEqual(jasmine.any(SharedModels.ReferenceObject));

        variant.elements.forEach(element => {
            const originalElement = originalItem.elements.find(m => m.element.id === element.element.id);

            expect(element).toEqual(jasmine.any(ElementModels.ContentItemElement));

            if (!originalElement) {
                throw Error(`Original element with id '${element.element.id}' was not found`);
            }

            if (Array.isArray(element.value)) {
                element.value.forEach(elementReference => {
                    expect(elementReference).toEqual(jasmine.any(SharedModels.ReferenceObject));
                });
            } else {
                expect(element.value).toEqual(originalElement.value as string | number);
            }
        });
    });

});
