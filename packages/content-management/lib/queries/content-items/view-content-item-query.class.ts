import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { ContentItemResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ViewContentItemQuery extends BaseQuery<ContentItemResponses.ViewContentItemResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected itemIdentifierType: 'internalId' | 'externalId' | 'codename',
    protected itemIdentifierValue: string
  ) {
    super(config, queryService);
  }

  getObservable(): Observable<ContentItemResponses.ViewContentItemResponse> {
    return this.queryService.viewContentItem(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    if (this.itemIdentifierType === 'internalId') {
      return this.actions.viewContentItemByInternalId(this.itemIdentifierValue);
    }
    if (this.itemIdentifierType === 'codename') {
      return this.actions.viewContentItemByCodename(this.itemIdentifierValue);
    }
    if (this.itemIdentifierType === 'externalId') {
      return this.actions.viewContentItemByExternalId(this.itemIdentifierValue);
    }

    throw Error(`Item identifier type '${this.itemIdentifierType}' is not supported`);
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
    return new ViewContentItemQuery(this.config, this.queryService, 'internalId', id);
  }

  /**
 * Gets query for content item using external Id
 * @param id External Id of content item
 */
  byExternalId(id: string): ViewContentItemQuery {
    return new ViewContentItemQuery(this.config, this.queryService, 'externalId', id);
  }

  /**
 * Gets query for content item using codename
 * @param codename Codename of content item
 */
  byCodename(codename: string): ViewContentItemQuery {
    return new ViewContentItemQuery(this.config, this.queryService, 'codename', codename);
  }
}
