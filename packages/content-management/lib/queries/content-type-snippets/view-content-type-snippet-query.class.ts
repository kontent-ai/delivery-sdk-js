import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { ContentTypeSnippetResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ViewContentTypeSnippetQuery extends BaseQuery<ContentTypeSnippetResponses.ViewContentTypeSnippetResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected identifier: Identifiers.ContentItemIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<ContentTypeSnippetResponses.ViewContentTypeSnippetResponse> {
    return this.queryService.viewContentTypeSnippet(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.actions.contentItemActions.viewContentTypeSnippet(this.identifier);
  }
}

