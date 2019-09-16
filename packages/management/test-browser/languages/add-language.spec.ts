import { LanguageModels, LanguageResponses } from '../../lib';
import * as responseJson from '../fake-responses/languages/fake-add-language.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Add language', () => {
    let response: LanguageResponses.AddLanguageResponse;

    beforeAll(done => {
        getTestClientWithJson(responseJson)
            .addLanguage()
            .withData({
                codname: 'x',
                external_id: undefined,
                fallback_language: undefined,
                is_active: true,
                name: 'x'
            })
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const url = cmTestClient
            .addLanguage()
            .withData({} as any)
            .getUrl();

        expect(url).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/languages`);
    });

    it(`response should be instance of AddLanguageResponse class`, () => {
        expect(response).toEqual(jasmine.any(LanguageResponses.AddLanguageResponse));
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
    });
});
