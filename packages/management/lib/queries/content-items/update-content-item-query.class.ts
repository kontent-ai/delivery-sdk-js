import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { ContentItemContracts } from '../../contracts';
import { Identifiers } from '../../models';
import { ContentItemResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class UpdateContentItemQuery extends BaseQuery<ContentItemResponses.UpdateContentItemResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public data: ContentItemContracts.IUpdateContentItemPostContract,
    public identifier: Identifiers.ContentItemIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<ContentItemResponses.UpdateContentItemResponse> {
    return this.queryService.updateContentItem(this.getUrl(), this.data, this.queryConfig);
  }

  protected getAction(): string {
      return this.apiEndpoints.updateContentItem(this.identifier);
  }
}
