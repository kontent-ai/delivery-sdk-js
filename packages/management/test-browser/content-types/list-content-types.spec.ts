import { ContentTypeResponses, SharedModels } from '../../lib';
import * as listContentTypesJson from '../fake-responses/content-types/fake-list-content-types.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';


describe('List content types', () => {
    let response: ContentTypeResponses.ContentTypeListResponse;

    beforeAll((done) => {
        getTestClientWithJson(listContentTypesJson).listContentTypes()
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const url = cmTestClient.listContentTypes().getUrl();

        expect(url).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/types`);
    });

    it(`response should be instance of ContentTypeListResponse class`, () => {
        expect(response).toEqual(jasmine.any(ContentTypeResponses.ContentTypeListResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`pagination should be correct`, () => {
        expect(response.data.pagination).toEqual(jasmine.any(SharedModels.Pagination));
        expect(response.data.pagination.continuationToken).toEqual(listContentTypesJson.pagination.continuation_token);
        expect(response.data.pagination.nextPage).toEqual(listContentTypesJson.pagination.next_page);
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
        expect(Array.isArray(response.data.types)).toBeTruthy();
        expect(response.data.types.length).toEqual(listContentTypesJson.types.length);
        expect(response.data.types).toBeTruthy();
    });

    it(`content type properties should be mapped`, () => {
        const contentTypes = response.data.types;

        contentTypes.forEach(contentType => {
            const originalItem = listContentTypesJson.types.find(m => m.id === contentType.id);

            if (!originalItem) {
                throw Error(`Invalid content type with id '${contentType.id}'`);
            }

            expect(contentType.codename).toEqual(originalItem.codename);
            expect(contentType.name).toEqual(originalItem.name);
            expect(contentType.lastModified).toEqual(new Date(originalItem.last_modified));
            expect(contentType.elements.length).toEqual(originalItem.elements.length);
            expect(Array.isArray(contentType.elements)).toBeTruthy();

            contentType.elements.forEach(element => {

                const originalElement = originalItem.elements.find(m => m.id === element.id);
                if (!originalElement) {
                    throw Error(`Invalid element with id '${element.id}'`);
                }

                expect(element.codename).toEqual(originalElement.codename);

                if (originalElement.name) {
                    expect(element.name).toEqual(originalElement.name);
                }
                expect(element.type.toString().toLowerCase()).toEqual(originalElement.type.toLowerCase());
            });
        });

    });


});
