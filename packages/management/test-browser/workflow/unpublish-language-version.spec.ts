import { BaseResponses } from '../../lib';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Unpublish language version', () => {
    let response: BaseResponses.EmptyContentManagementResponse;

    beforeAll((done) => {
        getTestClientWithJson(undefined).unpublishLanguageVariant()
            .byItemCodename('x')
            .byLanguageCodename('y')
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const w1Url = cmTestClient.unpublishLanguageVariant().byItemCodename('x').byLanguageCodename('y').getUrl();

        expect(w1Url).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/items/codename/x/variants/codename/y/unpublish`);
    });

    it(`response should be instance of EmptyContentManagementResponse class`, () => {
        expect(response).toEqual(jasmine.any(BaseResponses.EmptyContentManagementResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should NOT contain data`, () => {
        expect(response.data).toBeUndefined();
    });

});

