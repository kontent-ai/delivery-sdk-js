import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { Identifiers, contentManagementApiEndpoints } from '../../models';
import { AssetResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class DeleteAssetQuery extends BaseQuery<AssetResponses.DeleteAssetResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public identifier: Identifiers.AssetIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<AssetResponses.DeleteAssetResponse> {
    return this.queryService.deleteAsset(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return contentManagementApiEndpoints.deleteAsset(this.identifier);
  }
}



