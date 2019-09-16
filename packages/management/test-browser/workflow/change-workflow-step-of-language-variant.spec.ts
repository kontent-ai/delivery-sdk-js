import { BaseResponses } from '../../lib';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Change workflow step of language variant', () => {
    let response: BaseResponses.EmptyContentManagementResponse;

    beforeAll((done) => {
        getTestClientWithJson(undefined).changeWorkflowStepOfLanguageVariant()
            .byItemCodename('x')
            .byLanguageCodename('y')
            .byWorkflowStepId('b')
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const w1Url = cmTestClient.changeWorkflowStepOfLanguageVariant().byItemCodename('x').byLanguageCodename('y').byWorkflowStepId('b').getUrl();

        expect(w1Url).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/items/codename/x/variants/codename/y/workflow/b`);
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

