import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { ContentItemResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';
import { ContentItemIdentifier } from '../../models';

export class ViewContentItemQuery extends BaseQuery<ContentItemResponses.ViewContentItemResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected identifier: ContentItemIdentifier,
    protected identifierValue: string
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<ContentItemResponses.ViewContentItemResponse> {
    return this.queryService.viewContentItem(this.getUrl(), this.queryConfig);
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

export class ViewContentItemQueryInit {
  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService
  ) {
  }

  /**
   * Gets query for content item using internal Id
   * @param id Internal Id of content item
   */
  byInternalId(id: string): ViewContentItemQuery {
    return new ViewContentItemQuery(this.config, this.queryService, ContentItemIdentifier.InternalId, id);
  }

  /**
 * Gets query for content item using external Id
 * @param id External Id of content item
 */
  byExternalId(id: string): ViewContentItemQuery {
    return new ViewContentItemQuery(this.config, this.queryService, ContentItemIdentifier.ExternalId, id);
  }

  /**
 * Gets query for content item using codename
 * @param codename Codename of content item
 */
  byCodename(codename: string): ViewContentItemQuery {
    return new ViewContentItemQuery(this.config, this.queryService, ContentItemIdentifier.Codename, codename);
  }
}
