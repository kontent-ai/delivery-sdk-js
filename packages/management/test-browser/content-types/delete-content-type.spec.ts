import { ContentTypeResponses } from '../../lib';
import * as deleteContentTypeJson from '../fake-responses/content-types/fake-delete-content-type.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Delete content type', () => {
    let response: ContentTypeResponses.DeleteContentTypeResponse;

    beforeAll((done) => {
        getTestClientWithJson(deleteContentTypeJson).deleteContentType().byTypeCodename('xxx')
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const codenameUrl = cmTestClient.deleteContentType().byTypeCodename('xCodename').getUrl();
        const internalIdUrl = cmTestClient.deleteContentType().byTypeId('xInternalId').getUrl();
        const externalIdUrl = cmTestClient.deleteContentType().byTypeExternalId('xExternalId').getUrl();

        expect(codenameUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/types/codename/xCodename`);
        expect(internalIdUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/types/xInternalId`);
        expect(externalIdUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/types/external-id/xExternalId`);
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

