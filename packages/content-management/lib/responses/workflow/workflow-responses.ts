import { WorkflowContracts } from '../../contracts/workflow-contracts';
import { WorkflowModels } from '../../models';
import { BaseResponses } from '../base-responses';

export namespace WorkflowResponses {

    export class ListWorkflowStepsResponse extends BaseResponses.BaseContentManagementResponse<WorkflowContracts.IListWorkflowStepsResponseContract, WorkflowModels.WorkflowStep[]>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: WorkflowContracts.IListWorkflowStepsResponseContract,
            data: WorkflowModels.WorkflowStep[]
        ) {
            super(debug, rawData, data);
        }
    }
}
