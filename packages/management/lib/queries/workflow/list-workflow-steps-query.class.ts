import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { WorkflowResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ListWorkflowStepsQuery extends BaseQuery<WorkflowResponses.ListWorkflowStepsResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<WorkflowResponses.ListWorkflowStepsResponse> {
    return this.queryService.listWorkflowSteps(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.listWorkflowSteps();
  }
}
