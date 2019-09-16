import { ContentItemResponses } from '../../lib';
import * as addContentItemResponseJson from '../fake-responses/content-items/fake-add-content-item.json';
import { getTestClientWithJson, cmTestClient, testProjectId } from '../setup';

describe('Add content item', () => {
    let response: ContentItemResponses.AddContentItemResponse;

    beforeAll((done) => {
        getTestClientWithJson(addContentItemResponseJson).addContentItem()
            .withData(
                {
                    external_id: undefined,
                    name: 'Add article test',
                    type: {
                        codename: 'article'
                    },
                    sitemap_locations: undefined
                }
            )
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const addUrl = cmTestClient.addContentItem().withData({} as any).getUrl();

        expect(addUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/items`);
    });

    it(`response should be instance of AddContentItemResponse class`, () => {
        expect(response).toEqual(jasmine.any(ContentItemResponses.AddContentItemResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
    });

    it(`item properties should be mapped`, () => {
        expect(response.data.codename).toEqual(addContentItemResponseJson.codename);
        expect(response.data.externalId).toEqual(addContentItemResponseJson.external_id);
        expect(response.data.id).toEqual(addContentItemResponseJson.id);
        expect(response.data.lastModified).toEqual(jasmine.any(Date));
        expect(response.data.lastModified).toEqual(new Date(addContentItemResponseJson.last_modified));
        expect(response.data.name).toEqual(addContentItemResponseJson.name);
        expect(response.data.type).toEqual(addContentItemResponseJson.type);
    });


});

