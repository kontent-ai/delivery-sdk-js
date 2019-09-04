import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { ContentTypeSnippetResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class DeleteContentTypeSnippetQuery extends BaseQuery<ContentTypeSnippetResponses.DeleteContentTypeSnippetResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public identifier: Identifiers.ContentTypeIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<ContentTypeSnippetResponses.DeleteContentTypeSnippetResponse> {
    return this.queryService.deleteContentTypeSnippet(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.deleteContentTypeSnippet(this.identifier);
  }
}
