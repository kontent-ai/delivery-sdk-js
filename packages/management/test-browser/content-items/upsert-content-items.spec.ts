import { ContentItemResponses } from '../../lib';
import * as upsertContentItemResponseJson from '../fake-responses/content-items/fake-update-content-item.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Upsert content item', () => {
    let response: ContentItemResponses.UpsertContentItemResponse;

    beforeAll((done) => {
        getTestClientWithJson(upsertContentItemResponseJson).upsertContentItem()
            .byItemExternalId('x')
            .withData({
                name: 'y',
                type: 'xType',
                sitemap_locations: undefined,
            })
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const externalIdUrl = cmTestClient.upsertContentItem().byItemExternalId('xExternalId').withData({} as any).getUrl();

        expect(externalIdUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/items/external-id/xExternalId`);
    });

    it(`response should be instance of UpsertContentItemResponse class`, () => {
        expect(response).toEqual(jasmine.any(ContentItemResponses.UpsertContentItemResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
    });

    it(`item properties should be mapped`, () => {
        expect(response.data.codename).toEqual(upsertContentItemResponseJson.codename);
        expect(response.data.externalId).toEqual(upsertContentItemResponseJson.external_id);
        expect(response.data.id).toEqual(upsertContentItemResponseJson.id);
        expect(response.data.lastModified).toEqual(jasmine.any(Date));
        expect(response.data.lastModified).toEqual(new Date(upsertContentItemResponseJson.last_modified));
        expect(response.data.name).toEqual(upsertContentItemResponseJson.name);
        expect(response.data.type).toEqual(upsertContentItemResponseJson.type);
    });


});

