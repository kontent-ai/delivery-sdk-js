import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { AssetResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ListAssetsQuery extends BaseQuery<AssetResponses.AssetsListResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<AssetResponses.AssetsListResponse> {
    return this.queryService.listAssets(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.listAssets();
  }
}
