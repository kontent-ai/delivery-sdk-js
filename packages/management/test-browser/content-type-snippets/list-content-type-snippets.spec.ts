import { ContentTypeSnippetResponses, SharedModels } from '../../lib';
import * as listContentTypesJson from '../fake-responses/content-type-snippets/fake-list-content-type-snippets.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('List content type snippets', () => {
    let response: ContentTypeSnippetResponses.ContentTypeSnippetListResponse;

    beforeAll((done) => {
        getTestClientWithJson(listContentTypesJson).listContentTypeSnippets()
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const url = cmTestClient.listContentTypeSnippets().getUrl();

        expect(url).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/snippets`);
    });

    it(`response should be instance of ContentTypeSnippetListResponse class`, () => {
        expect(response).toEqual(jasmine.any(ContentTypeSnippetResponses.ContentTypeSnippetListResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`pagination should be correct`, () => {
        expect(response.data.pagination).toEqual(jasmine.any(SharedModels.Pagination));
        expect(response.data.pagination.continuationToken).toEqual(listContentTypesJson.pagination.continuation_token);
        expect(response.data.pagination.nextPage).toEqual(listContentTypesJson.pagination.next_page);
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
        expect(Array.isArray(response.data.types)).toBeTruthy();
        expect(response.data.types.length).toEqual(listContentTypesJson.snippets.length);
        expect(response.data.types).toBeTruthy();
    });

    it(`content type snippet properties should be mapped`, () => {
        const contentTypeSnippets = response.data.types;

        contentTypeSnippets.forEach(contentTypeSnippet => {
            const originalItem = listContentTypesJson.snippets.find(m => m.id === contentTypeSnippet.id);

            if (!originalItem) {
                throw Error(`Invalid content type snippet with id '${contentTypeSnippet.id}'`);
            }

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

                if (originalElement.name) {
                    expect(element.name).toEqual(originalElement.name);
                }
                expect(element.type.toString().toLowerCase()).toEqual(originalElement.type.toLowerCase());
            });
        });

    });


});
