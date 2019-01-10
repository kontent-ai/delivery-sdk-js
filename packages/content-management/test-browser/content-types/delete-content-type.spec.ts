import { ContentTypeResponses } from '../../lib';
import * as deleteContentTypeJson from '../fake-responses/content-types/fake-delete-content-type.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Delete content type', () => {
    let response: ContentTypeResponses.DeleteContentTypeResponse;

    beforeAll((done) => {
        getTestClientWithJson(deleteContentTypeJson).deleteContentType().byCodename('xxx')
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const codenameUrl = cmTestClient.deleteContentType().byCodename('xCodename').getUrl();
        const internalIdUrl = cmTestClient.deleteContentType().byInternalId('xInternalId').getUrl();

        expect(codenameUrl).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/types/codename/xCodename`);
        expect(internalIdUrl).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/types/xInternalId`);
    });

    it(`response should be instance of DeleteContentTypeResponse class`, () => {
        expect(response).toEqual(jasmine.any(ContentTypeResponses.DeleteContentTypeResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should be emmpty`, () => {
        expect(response.data).toBeUndefined();
    });
});

