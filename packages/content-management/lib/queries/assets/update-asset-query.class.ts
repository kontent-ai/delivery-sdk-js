import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { AssetModels } from '../../models';
import { AssetResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class UpdateAssetQuery extends BaseQuery<AssetResponses.UpdateAssetResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected data: AssetModels.IUpdateAssetRequestData,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<AssetResponses.UpdateAssetResponse> {
    return this.queryService.updateAsset(this.getUrl(), this.data, this.queryConfig);
  }

  protected getAction(): string {
    return this.actions.contentItemActions.updateAsset(this.data.assetId);
  }
}


