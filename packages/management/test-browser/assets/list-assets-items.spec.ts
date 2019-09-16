import { AssetModels, AssetResponses, SharedModels } from '../../lib';
import * as listingAssetsResponseJson from '../fake-responses/assets/fake-list-assets.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('List assets', () => {
    let response: AssetResponses.AssetsListResponse;

    beforeAll((done) => {
        getTestClientWithJson(listingAssetsResponseJson).listAssets()
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const listUrl = cmTestClient.listAssets().getUrl();

        expect(listUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/assets`);
    });

    it(`response should be instance of AssetsListResponse class`, () => {
        expect(response).toEqual(jasmine.any(AssetResponses.AssetsListResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
        expect(response.data.pagination).toBeDefined();
    });

    it(`pagination should be correct`, () => {
        expect(response.data.pagination.continuationToken).toEqual(listingAssetsResponseJson.pagination.continuation_token);
        expect(response.data.pagination.nextPage).toEqual(listingAssetsResponseJson.pagination.next_page);
    });

    it(`asset properties should be mapped`, () => {
        expect(response.data.items).toBeDefined();
        expect(Array.isArray(response.data.items)).toBeTruthy();
        expect(response.data.items.length).toBeGreaterThan(0);

        response.data.items.forEach(m => {
            // find original item
            const originalItem = listingAssetsResponseJson.assets.find(s => s.id === m.id);

            if (!originalItem) {
                throw Error(`Asset with id '${m.id}' was not found in fake response`);
            }

            expect(m.fileName).toEqual(originalItem.file_name);
            expect(m.type).toEqual(originalItem.type);
            expect(m.lastModified).toEqual(new Date(originalItem.last_modified));
            expect(m.imageHeight).toEqual(originalItem.image_height);
            expect(m.title).toEqual(originalItem.title);
            expect(m.externalId).toEqual(undefined);
            expect(m.imageWidth).toEqual(originalItem.image_width);
            expect(m.size).toEqual(originalItem.size);
            expect(m.fileReference).toEqual(jasmine.any(AssetModels.AssetFileReference));
            expect(m.fileReference.id).toEqual(originalItem.file_reference.id);
            expect(m.fileReference.type).toEqual(originalItem.file_reference.type);

            m.descriptions.forEach(s => {
                expect(s.description).toBeDefined();
                expect(s.language).toEqual(jasmine.any(SharedModels.ReferenceObject));
            });
        });
    });


});

