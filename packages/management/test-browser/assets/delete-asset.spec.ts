import { AssetResponses } from '../../lib';
import * as deleteAssetJson from '../fake-responses/assets/fake-delete-asset.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Delete asset', () => {
    let response: AssetResponses.DeleteAssetResponse;

    beforeAll((done) => {
        getTestClientWithJson(deleteAssetJson).deleteAsset().byAssetExternalId('xxx')
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const internalIdUrl = cmTestClient.deleteAsset().byAssetId('xInternalId').getUrl();
        const externalIdUrl = cmTestClient.deleteAsset().byAssetExternalId('xExternalId').getUrl();

        expect(internalIdUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/assets/xInternalId`);
        expect(externalIdUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/assets/external-id/xExternalId`);
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

