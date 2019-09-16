import { ContentTypeSnippetResponses, ElementModels } from '../../lib';
import * as responseJson from '../fake-responses/content-type-snippets/fake-add-content-type-snippet.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';


describe('Add content type snippet', () => {
    let response: ContentTypeSnippetResponses.AddContentTypeSnippetResponse;

    beforeAll((done) => {
        getTestClientWithJson(responseJson).addContentTypeSnippet()
            .withData({
                external_id: 'exId',
                name: 'name',
                elements: [{
                    name: '',
                    type: ElementModels.ElementType.number,
                }]
            })
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const url = cmTestClient.addContentTypeSnippet().withData({} as any).getUrl();
        expect(url).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/snippets`);
    });

    it(`response should be instance of AddContentTypeSnippetResponse class`, () => {
        expect(response).toEqual(jasmine.any(ContentTypeSnippetResponses.AddContentTypeSnippetResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
    });

    it(`content type properties should be mapped`, () => {
        const originalItem = responseJson;
        const contentType = response.data;

        expect(contentType.codename).toEqual(originalItem.codename);
        expect(contentType.name).toEqual(originalItem.name);
        expect(contentType.lastModified).toEqual(new Date(originalItem.last_modified));
        expect(contentType.elements.length).toEqual(originalItem.elements.length);
        expect(Array.isArray(contentType.elements)).toBeTruthy();

        contentType.elements.forEach(element => {

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


