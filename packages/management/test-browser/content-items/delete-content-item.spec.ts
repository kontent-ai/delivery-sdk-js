import { ContentItemResponses } from '../../lib';
import * as deleteContentItemJson from '../fake-responses/content-items/fake-delete-content-item.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Delete content item', () => {
    let response: ContentItemResponses.DeleteContentItemResponse;

    beforeAll((done) => {
        getTestClientWithJson(deleteContentItemJson).deleteContentItem().byItemCodename('xxx')
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const codenameUrl = cmTestClient.deleteContentItem().byItemCodename('xCodename').getUrl();
        const internalIdUrl = cmTestClient.deleteContentItem().byItemId('xInternalId').getUrl();
        const externalIdUrl = cmTestClient.deleteContentItem().byItemExternalId('xExternalId').getUrl();

        expect(codenameUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/items/codename/xCodename`);
        expect(internalIdUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/items/xInternalId`);
        expect(externalIdUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/items/external-id/xExternalId`);
    });

    it(`response should be instance of DeleteContentItemResponse class`, () => {
        expect(response).toEqual(jasmine.any(ContentItemResponses.DeleteContentItemResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should be empty`, () => {
        expect(response.data).toBeUndefined();
    });
});

