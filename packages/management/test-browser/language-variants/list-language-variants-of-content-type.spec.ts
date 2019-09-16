import { ElementModels, LanguageVariantResponses, SharedModels } from '../../lib';
import * as responseJson from '../fake-responses/language-variants/fake-list-language-variants-of-content-type.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';


describe('List language variants of content type', () => {
    let response: LanguageVariantResponses.ListLanguageVariantsOfContentTypeResponse;

    beforeAll((done) => {
        getTestClientWithJson(responseJson).listLanguageVariantsOfContentType()
            .byTypeCodename('xxx')
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const codenameUrl = cmTestClient.listLanguageVariantsOfContentType().byTypeCodename('xCodename').getUrl();
        const externalIdUrl = cmTestClient.listLanguageVariantsOfContentType().byTypeExternalId('xExternalId').getUrl();

        expect(codenameUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/types/codename/xCodename/variants`);
        expect(externalIdUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/types/external-id/xExternalId/variants`);
    });

    it(`response should be instance of ListLanguageVariantsOfContentTypeResponse class`, () => {
        expect(response).toEqual(jasmine.any(LanguageVariantResponses.ListLanguageVariantsOfContentTypeResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
        expect(response.data.variants).toBeDefined();
    });

    it(`item properties should be mapped`, () => {
        expect(response.data.variants).toBeDefined();
        expect(response.data.variants.length).toEqual(responseJson.variants.length);
        expect(response.data.pagination).toEqual(jasmine.any(SharedModels.Pagination));

        response.data.variants.forEach(variant => {

            const originalItem = responseJson.variants.find(m => m.item.id === variant.item.id);

            if (!originalItem) {
                throw Error(`Could not find original item with id '${variant.item.id}'`);
            }

            expect(variant.item).toBeDefined();
            expect(variant.language).toBeDefined();
            expect(variant.elements).toBeDefined();
            expect(variant.lastModified).toEqual(jasmine.any(Date));
            expect(variant.workflowStep).toBeDefined();
            expect(variant.workflowStep.id).toEqual(originalItem.workflow_step.id);

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

});
