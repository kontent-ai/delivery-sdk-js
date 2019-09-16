import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { ContentTypeResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ViewContentTypeQuery extends BaseQuery<ContentTypeResponses.ViewContentTypeResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public identifier: Identifiers.ContentTypeIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<ContentTypeResponses.ViewContentTypeResponse> {
    return this.queryService.viewContentType(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.viewContentType(this.identifier);
  }
}
