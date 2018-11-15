import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { ContentItemIdentifier } from '../../models';
import { ContentItemResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ListLanguageVariantsQuery extends BaseQuery<ContentItemResponses.ListLanguageVariantsResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected identifier: ContentItemIdentifier,
    protected identifierValue: string
  ) {
    super(config, queryService);
  }

  getObservable(): Observable<ContentItemResponses.ListLanguageVariantsResponse> {
    return this.queryService.listLanguageVariants(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    if (this.identifier === ContentItemIdentifier.InternalId) {
      return this.actions.contentItemActions.listLanguageVariantsByInternalId(this.identifierValue);
    }
    if (this.identifier === ContentItemIdentifier.Codename) {
      return this.actions.contentItemActions.listLanguageVariantsByCodename(this.identifierValue);
    }
    if (this.identifier === ContentItemIdentifier.ExternalId) {
      return this.actions.contentItemActions.listLanguageVariantsByExternalId(this.identifierValue);
    }

    throw Error(`Item identifier type '${this.identifier}' is not supported`);
  }
}

export class ListLanguageVariantsQueryInit {
  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService
  ) {
  }

  /**
   * Gets query for content item using internal Id
   * @param id Internal Id of content item
   */
  byInternalId(id: string): ListLanguageVariantsQuery {
    return new ListLanguageVariantsQuery(this.config, this.queryService, ContentItemIdentifier.InternalId, id);
  }

  /**
 * Gets query for content item using external Id
 * @param id External Id of content item
 */
  byExternalId(id: string): ListLanguageVariantsQuery {
    return new ListLanguageVariantsQuery(this.config, this.queryService, ContentItemIdentifier.ExternalId, id);
  }

  /**
 * Gets query for content item using codename
 * @param codename Codename of content item
 */
  byCodename(codename: string): ListLanguageVariantsQuery {
    return new ListLanguageVariantsQuery(this.config, this.queryService, ContentItemIdentifier.Codename, codename);
  }
}
