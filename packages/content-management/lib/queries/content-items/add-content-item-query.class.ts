import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { ContentItemResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';
import { ContentItemContracts } from '../../contracts';

export class AddContentItemQuery extends BaseQuery<ContentItemResponses.AddContentItemResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected data: ContentItemContracts.IAddContentItemPostContract
  ) {
    super(config, queryService);
  }

  getObservable(): Observable<ContentItemResponses.AddContentItemResponse> {
    return this.queryService.addContentItem(this.getUrl(), this.data, this.queryConfig);
  }

  protected getAction(): string {
    return this.actions.contentItemActions.addContentItem();
  }
}
