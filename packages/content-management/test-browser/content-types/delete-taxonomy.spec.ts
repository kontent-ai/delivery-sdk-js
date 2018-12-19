
import { TaxonomyResponses } from '../../lib';
import * as deleteTaxonomyJson from '../fake-responses/taxonomies/fake-delete-taxonomy.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Delete taxonomy', () => {
    let response: TaxonomyResponses.DeleteTaxonomyResponse;

    beforeAll((done) => {
        getTestClientWithJson(deleteTaxonomyJson).deleteTaxonomy().byCodename('xxx')
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const codenameUrl = cmTestClient.deleteTaxonomy().byCodename('xCodename').getUrl();
        const internalIdUrl = cmTestClient.deleteTaxonomy().byInternalId('xInternalId').getUrl();
        const externalIdUrl = cmTestClient.deleteTaxonomy().byExternalId('xExternalId').getUrl();

        expect(codenameUrl).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/taxonomies/codename/xCodename`);
        expect(internalIdUrl).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/taxonomies/xInternalId`);
        expect(externalIdUrl).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/taxonomies/external-id/xExternalId`);
    });

    it(`response should be instance of DeleteTaxonomyResponse class`, () => {
        expect(response).toEqual(jasmine.any(TaxonomyResponses.DeleteTaxonomyResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should be emmpty`, () => {
        expect(response.data).toBeUndefined();
    });
});

