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

    export class PublishOrScheduleLanguageVariant extends BaseResponses.BaseContentManagementResponse<void, void>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: void,
            data: void
        ) {
            super(debug, rawData, data);
        }
    }

    export class CreateNewVersionOfLanguageVariant extends BaseResponses.BaseContentManagementResponse<void, void>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: void,
            data: void
        ) {
            super(debug, rawData, data);
        }
    }

    export class UnpublishLanguageVariant extends BaseResponses.BaseContentManagementResponse<void, void>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: void,
            data: void
        ) {
            super(debug, rawData, data);
        }
    }

    export class CancelScheduledPublishingOrLanguageVariant extends BaseResponses.BaseContentManagementResponse<void, void>  {
        constructor(
            debug: BaseResponses.IContentManagementResponseDebug,
            rawData: void,
            data: void
        ) {
            super(debug, rawData, data);
        }
    }
}
