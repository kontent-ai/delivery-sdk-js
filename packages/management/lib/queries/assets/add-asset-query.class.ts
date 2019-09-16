import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { AssetModels } from '../../models';
import { AssetResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class AddAssetQuery extends BaseQuery<AssetResponses.AddAssetResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public data: AssetModels.IAddAssetRequestData,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<AssetResponses.AddAssetResponse> {
    return this.queryService.addAsset(this.getUrl(), this.data, this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.addAsset();
  }
}

