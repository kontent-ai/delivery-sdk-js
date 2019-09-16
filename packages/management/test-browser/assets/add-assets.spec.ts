import { AssetModels, AssetResponses, SharedModels } from '../../lib';
import * as addAssetResponseJson from '../fake-responses/assets/fake-add-asset.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Add asset', () => {
    let response: AssetResponses.AddAssetResponse;

    beforeAll((done) => {
        getTestClientWithJson(addAssetResponseJson).addAsset()
            .withData({
                descriptions: [],
                fileReference: {
                    id: 'x',
                    type: 'y'
                }
            })
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const url = cmTestClient.addAsset()
            .withData({
                descriptions: [],
                fileReference: {
                    id: 'x',
                    type: 'y'
                }
            }).getUrl();

        expect(url).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/assets`);
    });

    it(`response should be instance of AddAssetResponse class`, () => {
        expect(response).toEqual(jasmine.any(AssetResponses.AddAssetResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
        expect(response.data).toEqual(jasmine.any(AssetModels.Asset));
    });

    it(`asset properties should be mapped`, () => {
        const originalItem = addAssetResponseJson;
        const asset = response.data;

        expect(asset.fileName).toEqual(originalItem.file_name);
        expect(asset.type).toEqual(originalItem.type);
        expect(asset.lastModified).toEqual(new Date(originalItem.last_modified));
        expect(asset.imageHeight).toEqual(originalItem.image_height);
        expect(asset.title).toEqual(originalItem.title);
        expect(asset.externalId).toEqual(originalItem.external_id);
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

