import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { AssetResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class DeleteAssetQuery extends BaseQuery<AssetResponses.DeleteAssetResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public identifier: Identifiers.AssetIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<AssetResponses.DeleteAssetResponse> {
    return this.queryService.deleteAsset(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.actions.contentItemActions.deleteAsset(this.identifier);
  }
}



