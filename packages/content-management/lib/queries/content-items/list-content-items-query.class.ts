import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { ContentItemsResponse } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ListContentItemsQuery extends BaseQuery<ContentItemsResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService
  ) {
    super(config, queryService);
  }

  getObservable(): Observable<ContentItemsResponse> {
    return this.queryService.listContentItems(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.actions.items();
  }
}
