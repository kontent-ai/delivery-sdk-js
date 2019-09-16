import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { ProjectResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ValidateProjectContentQuery extends BaseQuery<ProjectResponses.ValidateProjectContentResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public projectId: string,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<ProjectResponses.ValidateProjectContentResponse> {
    return this.queryService.validateProjectContent(this.getUrl(), {
      projectId: this.projectId
    }, this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.validateProjectContent();
  }
}

