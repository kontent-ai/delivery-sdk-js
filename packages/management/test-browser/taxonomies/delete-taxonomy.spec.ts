
import { TaxonomyResponses } from '../../lib';
import * as deleteTaxonomyJson from '../fake-responses/taxonomies/fake-delete-taxonomy.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Delete taxonomy', () => {
    let response: TaxonomyResponses.DeleteTaxonomyResponse;

    beforeAll((done) => {
        getTestClientWithJson(deleteTaxonomyJson).deleteTaxonomy().byTaxonomyCodename('xxx')
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const codenameUrl = cmTestClient.deleteTaxonomy().byTaxonomyCodename('xCodename').getUrl();
        const internalIdUrl = cmTestClient.deleteTaxonomy().byTaxonomyId('xInternalId').getUrl();
        const externalIdUrl = cmTestClient.deleteTaxonomy().byTaxonomyExternalId('xExternalId').getUrl();

        expect(codenameUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/taxonomies/codename/xCodename`);
        expect(internalIdUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/taxonomies/xInternalId`);
        expect(externalIdUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/taxonomies/external-id/xExternalId`);
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

