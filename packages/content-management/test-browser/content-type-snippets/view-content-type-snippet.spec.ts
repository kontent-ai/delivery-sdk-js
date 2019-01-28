import { ContentTypeSnippetResponses } from '../../lib';
import * as responseJson from '../fake-responses/content-types/fake-view-content-type.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';


describe('View content type snippet', () => {
    let response: ContentTypeSnippetResponses.ViewContentTypeSnippetResponse;

    beforeAll((done) => {
        getTestClientWithJson(responseJson).viewContentTypeSnippet()
            .byCodename('xxx')
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const urlByCodename = cmTestClient.viewContentTypeSnippet().byCodename('x').getUrl();
        const urlByInternalId = cmTestClient.viewContentTypeSnippet().byInternalId('y').getUrl();

        expect(urlByCodename).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/snippets/codename/x`);
        expect(urlByInternalId).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/snippets/y`);
    });

    it(`response should be instance of ViewContentTypeSnippetResponse class`, () => {
        expect(response).toEqual(jasmine.any(ContentTypeSnippetResponses.ViewContentTypeSnippetResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
    });

    it(`content type snippet properties should be mapped`, () => {
        const originalItem = responseJson;
        const contentTypeSnippet = response.data;

        expect(contentTypeSnippet.codename).toEqual(originalItem.codename);
        expect(contentTypeSnippet.name).toEqual(originalItem.name);
        expect(contentTypeSnippet.lastModified).toEqual(new Date(originalItem.last_modified));
        expect(contentTypeSnippet.elements.length).toEqual(originalItem.elements.length);
        expect(Array.isArray(contentTypeSnippet.elements)).toBeTruthy();

        contentTypeSnippet.elements.forEach(element => {

            const originalElement = originalItem.elements.find(m => m.id === element.id);
            if (!originalElement) {
                throw Error(`Invalid element with id '${element.id}'`);
            }

            expect(element.codename).toEqual(originalElement.codename);
            expect(element.name).toEqual(originalElement.name);
            expect(element.type.toString().toLowerCase()).toEqual(originalElement.type.toLowerCase());
        });
    });


});


