import { ContentTypeSnippetResponses } from '../../lib';
import * as jsonResponse from '../fake-responses/content-type-snippets/fake-delete-content-type-snippet.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Delete content type snippet', () => {
    let response: ContentTypeSnippetResponses.DeleteContentTypeSnippetResponse;

    beforeAll((done) => {
        getTestClientWithJson(jsonResponse).deleteContentTypeSnippet().byTypeCodename('xxx')
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const codenameUrl = cmTestClient.deleteContentTypeSnippet().byTypeCodename('xCodename').getUrl();
        const idUrl = cmTestClient.deleteContentTypeSnippet().byTypeId('xInternalId').getUrl();
        const externalIdUrl = cmTestClient.deleteContentTypeSnippet().byTypeExternalId('xExternal').getUrl();

        expect(codenameUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/snippets/codename/xCodename`);
        expect(idUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/snippets/xInternalId`);
        expect(externalIdUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/snippets/external-id/xExternal`);
    });

    it(`response should be instance of DeleteContentTypeSnippetResponse class`, () => {
        expect(response).toEqual(jasmine.any(ContentTypeSnippetResponses.DeleteContentTypeSnippetResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should be emmpty`, () => {
        expect(response.data).toBeUndefined();
    });
});

