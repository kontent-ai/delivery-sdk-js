import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { AssetResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ViewAssetsQuery extends BaseQuery<AssetResponses.ViewAssetResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public identifier: Identifiers.AssetIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<AssetResponses.ViewAssetResponse> {
    return this.queryService.viewAsset(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
      return this.apiEndpoints.viewAsset(this.identifier);
  }
}

