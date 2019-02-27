import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { WorkflowResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ChangeWorkflowStepOfLanguageOrVariant extends BaseQuery<WorkflowResponses.ChangeWorkflowStepOfLanguageVariant> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected contentItemIdentifier: Identifiers.ContentItemIdentifier,
    protected languageIdentifier: Identifiers.LanguageIdentifier,
    protected workflowIdentifier: Identifiers.WorkflowIdentifier
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<WorkflowResponses.ChangeWorkflowStepOfLanguageVariant> {
    return this.queryService.changeWorkflowStepOfLanguageVariant(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.actions.contentItemActions.changeWorkflowStepOfLanguageVariant(this.contentItemIdentifier, this.languageIdentifier, this.workflowIdentifier);
  }
}
