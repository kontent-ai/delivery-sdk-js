import { AssetModels, AssetResponses, SharedModels } from '../../lib';
import * as updateAssetResponseJson from '../fake-responses/assets/fake-update-asset.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Update asset', () => {
    let response: AssetResponses.UpdateAssetResponse;

    beforeAll((done) => {
        getTestClientWithJson(updateAssetResponseJson).updateAsset()
            .withData({
                descriptions: [],
                assetId: 'x'
            })
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const listUrl = cmTestClient.updateAsset().withData({
            descriptions: [],
            assetId: 'x'
        }).getUrl();

        expect(listUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/assets/x`);
    });

    it(`response should be instance of UpdateAssetResponse class`, () => {
        expect(response).toEqual(jasmine.any(AssetResponses.UpdateAssetResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
        expect(response.data).toEqual(jasmine.any(AssetModels.Asset));
    });

    it(`asset properties should be mapped`, () => {
        const originalItem = updateAssetResponseJson;
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

