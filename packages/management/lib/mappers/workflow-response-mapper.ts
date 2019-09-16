import { IBaseResponse } from '@kentico/kontent-core';

import { WorkflowContracts } from '../contracts/workflow-contracts';
import { WorkflowModels } from '../models';
import { WorkflowResponses } from '../responses';
import { BaseMapper } from './base-mapper';

export class WorkflowResponseMapper extends BaseMapper {

    mapListWorkflowStepsResponse(
        response: IBaseResponse<WorkflowContracts.IListWorkflowStepsResponseContract>
    ): WorkflowResponses.ListWorkflowStepsResponse {

        const workflowSteps = response.data.map(m => this.mapWorkflowStep(m));

        return new WorkflowResponses.ListWorkflowStepsResponse(super.mapResponseDebug(response), response.data, workflowSteps);
    }

    private mapWorkflowStep(rawStep: WorkflowContracts.IWorkflowStepContract): WorkflowModels.WorkflowStep {
        return new WorkflowModels.WorkflowStep({
            id: rawStep.id,
            name: rawStep.name,
            transitionsTo: rawStep.transitions_to
        });
    }
}

export const workflowResponseMapper = new WorkflowResponseMapper();
