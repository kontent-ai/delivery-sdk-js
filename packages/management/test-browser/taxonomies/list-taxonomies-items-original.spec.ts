import { TaxonomyModels, TaxonomyResponses } from '../../lib';
import * as listingTaxonomyResponseJson from '../fake-responses/taxonomies/fake-list-taxonomies-original.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('List taxonomies original (before API breaking change)', () => {
    let response: TaxonomyResponses.TaxonomyListResponse;

    beforeAll((done) => {
        getTestClientWithJson(listingTaxonomyResponseJson).listTaxonomies()
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const listUrl = cmTestClient.listTaxonomies().getUrl();

        expect(listUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/taxonomies`);
    });

    it(`response should be instance of TaxonomyListResponse class`, () => {
        expect(response).toEqual(jasmine.any(TaxonomyResponses.TaxonomyListResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
    });

    it(`taxonomy properties should be mapped`, () => {
        expect(Array.isArray(response.data.taxonomies)).toBeTruthy();
        expect(response.data.taxonomies.length).toEqual(listingTaxonomyResponseJson.length);

        response.data.taxonomies.forEach(m => {
            // find original item
            const originalItem = listingTaxonomyResponseJson.find(s => s.id === m.id);

            if (!originalItem) {
                throw Error(`Taxonomy with id '${m.id}' was not found in fake response`);
            }

            expect(m.codename).toEqual(originalItem.codename);
            expect(m.id).toEqual(originalItem.id);
            expect(m.lastModified).toEqual(new Date(originalItem.last_modified));
            expect(m.name).toEqual(originalItem.name);
            expect(Array.isArray(m.terms)).toBeTruthy();

            m.terms.forEach(s => {
                expect(s).toEqual(jasmine.any(TaxonomyModels.Taxonomy));
            });
        });
    });


});

