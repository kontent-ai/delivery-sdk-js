import { ContentItemResponses } from '../../lib';
import * as updateContentItemResponseJson from '../fake-responses/content-items/fake-update-content-item.json';
import { getTestClientWithJson, cmTestClient, testProjectId } from '../setup';

describe('Update content item', () => {
    let response: ContentItemResponses.UpdateContentItemResponse;

    beforeAll((done) => {
        getTestClientWithJson(updateContentItemResponseJson).updateContentItem({
            name: 'Test article xxx',
            sitemap_locations: [],
        })
            .byCodename('test_article')
            .getObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const codenameUrl = cmTestClient.updateContentItem({} as any).byCodename('xCodename').getUrl();
        const internalIdUrl = cmTestClient.updateContentItem({} as any).byInternalId('xInternalId').getUrl();
        const externalIdUrl = cmTestClient.updateContentItem({} as any).byExternalId('xExternalId').getUrl();

        expect(codenameUrl).toEqual(`https://manage.kenticocloud.com/v1/projects/${testProjectId}/items/codename/xCodename`);
        expect(internalIdUrl).toEqual(`https://manage.kenticocloud.com/v1/projects/${testProjectId}/items/xInternalId`);
        expect(externalIdUrl).toEqual(`https://manage.kenticocloud.com/v1/projects/${testProjectId}/items/external-id/xExternalId`);
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

