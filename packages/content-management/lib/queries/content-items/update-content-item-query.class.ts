import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { ContentItemResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';
import { ContentItemContracts } from '../../contracts';
import { ContentItemIdentifier } from '../../models';

export class UpdateContentItemQuery extends BaseQuery<ContentItemResponses.UpdateContentItemResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected data: ContentItemContracts.IUpdateContentItemPostContract,
    protected identifier: ContentItemIdentifier,
    protected identifierValue: string
  ) {
    super(config, queryService);
  }

  getObservable(): Observable<ContentItemResponses.UpdateContentItemResponse> {
    return this.queryService.updateContentItem(this.getUrl(), this.data, this.queryConfig);
  }

  protected getAction(): string {
    if (this.identifier === ContentItemIdentifier.InternalId) {
      return this.actions.contentItemActions.updateContentItemByInternalId(this.identifierValue);
    }
    if (this.identifier === ContentItemIdentifier.Codename) {
      return this.actions.contentItemActions.updateContentItemByCodename(this.identifierValue);
    }
    if (this.identifier === ContentItemIdentifier.ExternalId) {
      return this.actions.contentItemActions.updateContentItemByExternalId(this.identifierValue);
    }

    throw Error(`Item identifier type '${this.identifier}' is not supported`);
  }
}

export class UpdateContentItemQueryInit {
  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected item: ContentItemContracts.IUpdateContentItemPostContract
  ) {
  }

  /**
   * Gets query for content item using internal Id
   * @param id Internal Id of content item
   */
  byInternalId(id: string): UpdateContentItemQuery {
    return new UpdateContentItemQuery(this.config, this.queryService, this.item, ContentItemIdentifier.InternalId, id);
  }

  /**
 * Gets query for content item using external Id
 * @param id External Id of content item
 */
  byExternalId(id: string): UpdateContentItemQuery {
    return new UpdateContentItemQuery(this.config, this.queryService, this.item, ContentItemIdentifier.ExternalId, id);
  }

  /**
 * Gets query for content item using codename
 * @param codename Codename of content item
 */
  byCodename(codename: string): UpdateContentItemQuery {
    return new UpdateContentItemQuery(this.config, this.queryService, this.item, ContentItemIdentifier.Codename, codename);
  }
}
