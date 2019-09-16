import { ContentItemResponses } from '../../lib';
import * as updateContentItemResponseJson from '../fake-responses/content-items/fake-update-content-item.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Update content item', () => {
    let response: ContentItemResponses.UpdateContentItemResponse;

    beforeAll((done) => {
        getTestClientWithJson(updateContentItemResponseJson).updateContentItem()
            .byItemCodename('x')
            .withData({
                name: 'y',
                sitemap_locations: [],
            })
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const codenameUrl = cmTestClient.updateContentItem().byItemCodename('xCodename').withData({} as any).getUrl();
        const internalIdUrl = cmTestClient.updateContentItem().byItemId('xInternalId').withData({} as any).getUrl();
        const externalIdUrl = cmTestClient.updateContentItem().byItemExternalId('xExternalId').withData({} as any).getUrl();

        expect(codenameUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/items/codename/xCodename`);
        expect(internalIdUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/items/xInternalId`);
        expect(externalIdUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/items/external-id/xExternalId`);
    });

    it(`response should be instance of UpdateContentItemResponse class`, () => {
        expect(response).toEqual(jasmine.any(ContentItemResponses.UpdateContentItemResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
    });

    it(`item properties should be mapped`, () => {
        expect(response.data.codename).toEqual(updateContentItemResponseJson.codename);
        expect(response.data.externalId).toEqual(updateContentItemResponseJson.external_id);
        expect(response.data.id).toEqual(updateContentItemResponseJson.id);
        expect(response.data.lastModified).toEqual(jasmine.any(Date));
        expect(response.data.lastModified).toEqual(new Date(updateContentItemResponseJson.last_modified));
        expect(response.data.name).toEqual(updateContentItemResponseJson.name);
        expect(response.data.type).toEqual(updateContentItemResponseJson.type);
    });


});

