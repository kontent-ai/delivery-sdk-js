import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { ContentTypeResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class DeleteContentTypeQuery extends BaseQuery<ContentTypeResponses.DeleteContentTypeResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public identifier: Identifiers.ContentTypeIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<ContentTypeResponses.DeleteContentTypeResponse> {
    return this.queryService.deleteContentType(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.deleteContentType(this.identifier);
  }
}
