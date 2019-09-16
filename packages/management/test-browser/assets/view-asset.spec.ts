import { AssetModels, AssetResponses, SharedModels } from '../../lib';
import * as viewAssetResponseJson from '../fake-responses/assets/fake-view-asset.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('View assets', () => {
    let response: AssetResponses.ViewAssetResponse;

    beforeAll((done) => {
        getTestClientWithJson(viewAssetResponseJson).viewAsset()
            .byAssetId('xxx')
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const internalIdUrl = cmTestClient.viewAsset().byAssetId('xInternalId').getUrl();
        const externalIdUrl = cmTestClient.viewAsset().byAssetExternalId('xExternalId').getUrl();

        expect(internalIdUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/assets/xInternalId`);
        expect(externalIdUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/assets/external-id/xExternalId`);
    });

    it(`response should be instance of ViewAssetResponse class`, () => {
        expect(response).toEqual(jasmine.any(AssetResponses.ViewAssetResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
    });

    it(`asset properties should be mapped`, () => {
        const originalItem = viewAssetResponseJson;
        const asset = response.data;

        expect(asset.fileName).toEqual(originalItem.file_name);
        expect(asset.type).toEqual(originalItem.type);
        expect(asset.lastModified).toEqual(new Date(originalItem.last_modified));
        expect(asset.imageHeight).toEqual(originalItem.image_height);
        expect(asset.title).toEqual(originalItem.title);
        expect(asset.externalId).toEqual(undefined);
        expect(asset.imageWidth).toEqual(originalItem.image_width);
        expect(asset.size).toEqual(originalItem.size);
        expect(asset.fileReference).toEqual(jasmine.any(AssetModels.AssetFileReference));
        expect(asset.fileReference.id).toEqual(originalItem.file_reference.id);
        expect(asset.fileReference.type).toEqual(originalItem.file_reference.type);

        asset.descriptions.forEach(s => {
            expect(s.description).toBeDefined();
            expect(s.language).toEqual(jasmine.any(SharedModels.ReferenceObject));
        });
    });


});

