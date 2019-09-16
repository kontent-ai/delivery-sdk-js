import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { ContentItemContracts } from '../../contracts';
import { Identifiers } from '../../models';
import { ContentItemResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class UpsertContentItemQuery extends BaseQuery<ContentItemResponses.UpsertContentItemResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public data: ContentItemContracts.IUpsertContentItemPostContract,
    public identifier: Identifiers.ContentItemIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<ContentItemResponses.UpsertContentItemResponse> {
    return this.queryService.upsertContentItem(this.getUrl(), this.data, this.queryConfig);
  }

  protected getAction(): string {
      return this.apiEndpoints.upsertContentItem(this.identifier);
  }
}
