import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { ContentTypeResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ListContentTypesQuery extends BaseQuery<ContentTypeResponses.ContentTypeListResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<ContentTypeResponses.ContentTypeListResponse> {
    return this.queryService.listContentTypes(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.actions.contentItemActions.listContentTypes();
  }
}
