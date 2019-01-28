import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { ContentItemIdentifier } from '../../models';
import { ContentTypeSnippetResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ViewContentTypeSnippetQuery extends BaseQuery<ContentTypeSnippetResponses.ViewContentTypeSnippetResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected identifier: ContentItemIdentifier,
    protected identifierValue: string
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<ContentTypeSnippetResponses.ViewContentTypeSnippetResponse> {
    return this.queryService.viewContentTypeSnippet(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    if (this.identifier === ContentItemIdentifier.InternalId) {
      return this.actions.contentItemActions.viewContentTypeSnippetByInternalId(this.identifierValue);
    }
    if (this.identifier === ContentItemIdentifier.Codename) {
      return this.actions.contentItemActions.viewContentTypeSnippetByCodename(this.identifierValue);
    }

    throw Error(`Item identifier type '${this.identifier}' is not supported`);
  }
}

