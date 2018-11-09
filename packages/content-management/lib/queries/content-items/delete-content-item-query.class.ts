import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { ContentItemResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';
import { ContentItemIdentifier } from '../../models';

export class DeleteContentItemQuery extends BaseQuery<ContentItemResponses.DeleteContentItemResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected identifier: ContentItemIdentifier,
    protected identifierValue: string
  ) {
    super(config, queryService);
  }

  getObservable(): Observable<ContentItemResponses.DeleteContentItemResponse> {
    return this.queryService.deleteContentItem(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    if (this.identifier === ContentItemIdentifier.InternalId) {
      return this.actions.contentItemActions.deleteContentItemByInternalId(this.identifierValue);
    }
    if (this.identifier === ContentItemIdentifier.Codename) {
      return this.actions.contentItemActions.deleteContentItemByCodename(this.identifierValue);
    }
    if (this.identifier === ContentItemIdentifier.ExternalId) {
      return this.actions.contentItemActions.deleteContentItemByExternalId(this.identifierValue);
    }


    throw Error(`Item identifier type '${this.identifier}' is not supported`);
  }
}

export class DeleteContentItemQueryInit {
  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService
  ) {
  }

  /**
   * Gets query for content item using internal Id
   * @param id Internal Id of content item
   */
  byInternalId(id: string): DeleteContentItemQuery {
    return new DeleteContentItemQuery(this.config, this.queryService, ContentItemIdentifier.InternalId, id);
  }

  /**
 * Gets query for content item using external Id
 * @param id External Id of content item
 */
  byExternalId(id: string): DeleteContentItemQuery {
    return new DeleteContentItemQuery(this.config, this.queryService, ContentItemIdentifier.ExternalId, id);
  }

  /**
 * Gets query for content item using codename
 * @param codename Codename of content item
 */
  byCodename(codename: string): DeleteContentItemQuery {
    return new DeleteContentItemQuery(this.config, this.queryService, ContentItemIdentifier.Codename, codename);
  }
}
