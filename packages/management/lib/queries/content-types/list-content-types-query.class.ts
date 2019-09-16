import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { ContentTypeResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ListContentTypesQuery extends BaseQuery<ContentTypeResponses.ContentTypeListResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<ContentTypeResponses.ContentTypeListResponse> {
    return this.queryService.listContentTypes(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.listContentTypes();
  }
}
