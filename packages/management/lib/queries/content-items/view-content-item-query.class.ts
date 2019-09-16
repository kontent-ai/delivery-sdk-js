import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { ContentItemResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ViewContentItemQuery extends BaseQuery<ContentItemResponses.ViewContentItemResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public identifier: Identifiers.ContentItemIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<ContentItemResponses.ViewContentItemResponse> {
    return this.queryService.viewContentItem(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.viewContentItem(this.identifier);
  }
}
