import { LanguageModels, LanguageResponses } from '../../lib';
import * as responseJson from '../fake-responses/languages/fake-view-language.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('View language', () => {
    let response: LanguageResponses.ViewLanguageResponse;

    beforeAll(done => {
        getTestClientWithJson(responseJson)
            .viewLanguage()
            .byLanguageCodename('x')
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const idUrl = cmTestClient
            .viewLanguage()
            .byLanguageId('xId')
            .getUrl();

        const codenameUrl = cmTestClient
            .viewLanguage()
            .byLanguageCodename('xCodename')
            .getUrl();

        const externalIdUrl = cmTestClient
            .viewLanguage()
            .byExternalId('xExternalId')
            .getUrl();

        expect(idUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/languages/xId`);
        expect(codenameUrl).toEqual(
            `https://manage.kontent.ai/v2/projects/${testProjectId}/languages/codename/xCodename`
        );
        expect(externalIdUrl).toEqual(
            `https://manage.kontent.ai/v2/projects/${testProjectId}/languages/external-id/xExternalId`
        );
    });

    it(`response should be instance of ViewLanguageResponse class`, () => {
        expect(response).toEqual(jasmine.any(LanguageResponses.ViewLanguageResponse));
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

        const langauge = response.data;

        expect(langauge.codename).toEqual(originalItem.codename);
        expect(langauge.id).toEqual(originalItem.id);
        expect(langauge.isActive).toEqual(originalItem.is_active);
        expect(langauge.isDefault).toEqual(originalItem.is_default);
        expect(langauge.name).toEqual(originalItem.name);
        expect(langauge.externalId).toEqual(originalItem.external_id);
        expect(langauge.fallbackLanguage ? langauge.fallbackLanguage.id : '').toEqual(
            originalItem.fallback_language.id
        );

        expect(langauge.fallbackLanguage).toEqual(jasmine.any(LanguageModels.FallbackLanguageModel));
    });
});
