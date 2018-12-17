import { AssetResponses } from '../../lib';
import * as deleteAssetJson from '../fake-responses/assets/fake-delete-asset.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Delete asset', () => {
    let response: AssetResponses.DeleteAssetResponse;

    beforeAll((done) => {
        getTestClientWithJson(deleteAssetJson).deleteAsset().byCodename('xxx')
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const codenameUrl = cmTestClient.deleteAsset().byCodename('xCodename').getUrl();
        const internalIdUrl = cmTestClient.deleteAsset().byInternalId('xInternalId').getUrl();
        const externalIdUrl = cmTestClient.deleteAsset().byExternalId('xExternalId').getUrl();

        expect(codenameUrl).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/assets/codename/xCodename`);
        expect(internalIdUrl).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/assets/xInternalId`);
        expect(externalIdUrl).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/assets/external-id/xExternalId`);
    });

    it(`response should be instance of DeleteAssetResponse class`, () => {
        expect(response).toEqual(jasmine.any(AssetResponses.DeleteAssetResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should be emmpty`, () => {
        expect(response.data).toBeUndefined();
    });
});

