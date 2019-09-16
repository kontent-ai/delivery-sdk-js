import { LanguageModels, LanguageResponses } from '../../lib';
import * as responseJson from '../fake-responses/languages/fake-modify-language.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Modify language', () => {
    let response: LanguageResponses.ModifyLanguageResponse;

    beforeAll(done => {
        getTestClientWithJson(responseJson)
            .modifyLanguage()
            .byLanguageCodename('x')
            .withData([
                {
                    op: 'replace',
                    property_name: 'name',
                    reference: {
                        codename: 'x'
                    },
                    value: 'y'
                }
            ])
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const idUrl = cmTestClient
            .modifyLanguage()
            .byLanguageId('xId')
            .withData({} as any)
            .getUrl();

        const codenameUrl = cmTestClient
            .modifyLanguage()
            .byLanguageCodename('xCodename')
            .withData({} as any)
            .getUrl();

        const externalIdUrl = cmTestClient
            .modifyLanguage()
            .byExternalId('xExternalId')
            .withData({} as any)
            .getUrl();

        expect(idUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/languages/xId`);
        expect(codenameUrl).toEqual(
            `https://manage.kontent.ai/v2/projects/${testProjectId}/languages/codename/xCodename`
        );
        expect(externalIdUrl).toEqual(
            `https://manage.kontent.ai/v2/projects/${testProjectId}/languages/external-id/xExternalId`
        );
    });

    it(`response should be instance of ModifyLanguageResponse class`, () => {
        expect(response).toEqual(jasmine.any(LanguageResponses.ModifyLanguageResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
        expect(response.data).toEqual(jasmine.any(LanguageModels.LanguageModel));
    });

    it(`properties should be mapped`, () => {
        const originalItem = responseJson;

        const language = response.data;

        expect(language.codename).toEqual(originalItem.codename);
        expect(language.id).toEqual(originalItem.id);
        expect(language.isActive).toEqual(originalItem.is_active);
        expect(language.isDefault).toEqual(originalItem.is_default);
        expect(language.name).toEqual(originalItem.name);
        expect(language.externalId).toEqual(originalItem.external_id);
        expect(language.fallbackLanguage ? language.fallbackLanguage.id : '').toEqual(
            originalItem.fallback_language.id
        );

        expect(language.fallbackLanguage).toEqual(jasmine.any(LanguageModels.FallbackLanguageModel));
    });
});
