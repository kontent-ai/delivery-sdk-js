import { LanguageModels, LanguageResponses, SharedModels } from '../../lib';
import * as responseJson from '../fake-responses/languages/fake-list-languages.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('List languages', () => {
    let response: LanguageResponses.ListLanguagesResponse;

    beforeAll(done => {
        getTestClientWithJson(responseJson)
            .listLanguages()
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const listUrl = cmTestClient.listLanguages().getUrl();

        expect(listUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/languages`);
    });

    it(`response should be instance of ListLanguagesResponse class`, () => {
        expect(response).toEqual(jasmine.any(LanguageResponses.ListLanguagesResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
    });

    it(`pagination should be correct`, () => {
        expect(response.data.pagination).toEqual(jasmine.any(SharedModels.Pagination));
        expect(response.data.pagination.continuationToken).toEqual(responseJson.pagination.continuation_token);
        expect(response.data.pagination.nextPage).toEqual(responseJson.pagination.next_page);
    });

    it(`properties should be mapped`, () => {
        expect(Array.isArray(response.data.languages)).toBeTruthy();
        expect(response.data.languages.length).toEqual(responseJson.languages.length);

        response.data.languages.forEach(language => {
            // find original item
            const originalItem = responseJson.languages.find(s => s.id === language.id);

            if (!originalItem) {
                throw Error(`Langauge with id '${language.id}' was not found in fake response`);
            }

            expect(language.codename).toEqual(originalItem.codename);
            expect(language.id).toEqual(originalItem.id);
            expect(language.isActive).toEqual(originalItem.is_active);
            expect(language.isDefault).toEqual(originalItem.is_default);
            expect(language.name).toEqual(originalItem.name);
            expect(language.fallbackLanguage ? language.fallbackLanguage.id : '').toEqual(
                originalItem.fallback_language.id
            );
            expect(language.fallbackLanguage).toEqual(jasmine.any(LanguageModels.FallbackLanguageModel));
        });
    });
});
