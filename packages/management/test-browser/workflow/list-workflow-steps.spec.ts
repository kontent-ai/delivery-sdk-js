import { WorkflowResponses } from '../../lib';
import * as jsonResponse from '../fake-responses/workflow/fake-list-workflow-steps.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('List workflow steps', () => {
    let response: WorkflowResponses.ListWorkflowStepsResponse;

    beforeAll((done) => {
        getTestClientWithJson(jsonResponse).listWorkflowSteps()
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const listUrl = cmTestClient.listWorkflowSteps().getUrl();

        expect(listUrl).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/workflow`);
    });

    it(`response should be instance of ListWorkflowStepsResponse class`, () => {
        expect(response).toEqual(jasmine.any(WorkflowResponses.ListWorkflowStepsResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
    });

    it(`workflow step properties should be mapped`, () => {
        expect(Array.isArray(response.data)).toBeTruthy();
        expect(response.data.length).toBeGreaterThan(0);

        response.data.forEach(m => {
            // find original item
            const originalItem = jsonResponse.find(s => s.id === m.id);

            if (!originalItem) {
                throw Error(`Workflow step with id '${m.id}' was not found in fake response`);
            }

            expect(m.id).toEqual(originalItem.id);
            expect(m.name).toEqual(originalItem.name);
            expect(Array.isArray(m.transitionsTo)).toBeTruthy();
        });
    });

});

