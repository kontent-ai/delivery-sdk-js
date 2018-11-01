import { ContentItemsResponse } from '../../lib';
import * as listingResponseJson from '../fake-responses/content-items/fake-list-content-items.json';
import { getTestClientWithJson } from '../setup';

describe('List content items', () => {
    let response: ContentItemsResponse;

    beforeAll((done) => {
        getTestClientWithJson(listingResponseJson).listContentItems()
            .getObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`response should be instance of ContentItemsResponse class`, () => {
        expect(response).toEqual(jasmine.any(ContentItemsResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
        expect(response.data.pagination).toBeDefined();
    });

    it(`item properties should be mapped`, () => {
        expect(response.data.items).toBeDefined();
        expect(Array.isArray(response.data.items)).toBeTruthy();
        expect(response.data.items.length).toBeGreaterThan(0);

        response.data.items.forEach(m => {
            expect(m.codename).toBeDefined();
            expect(m.id).toBeDefined();
            expect(m.lastModified).toBeDefined();
            expect(m.name).toBeDefined();
            expect(m.type).toBeDefined();
            expect(m.sitemapLocations).toBeDefined();
            expect(m.type.id).toBeDefined();
            expect(m.lastModified).toEqual(jasmine.any(Date));
        });
    });


});

