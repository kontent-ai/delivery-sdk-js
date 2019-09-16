import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { ContentItemResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class DeleteContentItemQuery extends BaseQuery<ContentItemResponses.DeleteContentItemResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public identifier: Identifiers.ContentItemIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<ContentItemResponses.DeleteContentItemResponse> {
    return this.queryService.deleteContentItem(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.deleteContentItem(this.identifier);
  }
}
