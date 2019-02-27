import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { WorkflowResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ListWorkflowStepsQuery extends BaseQuery<WorkflowResponses.ListWorkflowStepsResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<WorkflowResponses.ListWorkflowStepsResponse> {
    return this.queryService.listWorkflowSteps(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.actions.contentItemActions.listWorkflowSteps();
  }
}
