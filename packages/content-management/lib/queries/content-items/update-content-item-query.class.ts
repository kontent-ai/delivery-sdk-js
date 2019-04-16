import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { ContentItemContracts } from '../../contracts';
import { Identifiers } from '../../models';
import { ContentItemResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class UpdateContentItemQuery extends BaseQuery<ContentItemResponses.UpdateContentItemResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
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
      return this.actions.contentItemActions.updateContentItem(this.identifier);
  }
}

export class UpdateContentItemQueryData {
  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected identifier: Identifiers.ContentItemIdentifier,
  ) {
  }

  /**
   * Gets query for content item using internal Id
   * @param id Internal Id of content item
   */
  withData(item: ContentItemContracts.IUpdateContentItemPostContract): UpdateContentItemQuery {
    return new UpdateContentItemQuery(this.config, this.queryService, item, this.identifier);
  }
}

export class UpdateContentItemQueryInit {
  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
  ) {
  }

  /**
   * Gets query for content item using internal Id
   * @param id Internal Id of content item
   */
  byInternalId(id: string): UpdateContentItemQueryData {
    return new UpdateContentItemQueryData(this.config, this.queryService, new Identifiers.ContentItemIdentifier(Identifiers.ContentItemIdentifierEnum.InternalId, id));
  }

  /**
 * Gets query for content item using external Id
 * @param externalId External Id of content item
 */
  byExternalId(externalId: string): UpdateContentItemQueryData {
    return new UpdateContentItemQueryData(this.config, this.queryService,  new Identifiers.ContentItemIdentifier(Identifiers.ContentItemIdentifierEnum.ExternalId, externalId));
  }

  /**
 * Gets query for content item using codename
 * @param codename Codename of content item
 */
  byCodename(codename: string): UpdateContentItemQueryData {
    return new UpdateContentItemQueryData(this.config, this.queryService,  new Identifiers.ContentItemIdentifier(Identifiers.ContentItemIdentifierEnum.Codename, codename));
  }
}
