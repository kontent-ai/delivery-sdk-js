import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { ContentItemIdentifier } from '../../models';
import { AssetResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ViewAssetsQuery extends BaseQuery<AssetResponses.ViewAssetResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected identifier: ContentItemIdentifier,
    protected identifierValue: string
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<AssetResponses.ViewAssetResponse> {
    return this.queryService.viewAsset(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    if (this.identifier === ContentItemIdentifier.InternalId) {
      return this.actions.contentItemActions.viewAssetByInternalId(this.identifierValue);
    }
    if (this.identifier === ContentItemIdentifier.ExternalId) {
      return this.actions.contentItemActions.viewAssetByExternalId(this.identifierValue);
    }

    throw Error(`Item identifier type '${this.identifier}' is not supported`);
  }
}

export class ViewAssetsQueryInit {
  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
  ) {
  }

  /**
   * Gets query for content item using internal Id
   * @param id Internal Id of content item
   */
  byInternalId(id: string): ViewAssetsQuery {
    return new ViewAssetsQuery(this.config, this.queryService, ContentItemIdentifier.InternalId, id);
  }

  /**
 * Gets query for content item using external Id
 * @param id External Id of content item
 */
  byExternalId(id: string): ViewAssetsQuery {
    return new ViewAssetsQuery(this.config, this.queryService, ContentItemIdentifier.ExternalId, id);
  }

}

