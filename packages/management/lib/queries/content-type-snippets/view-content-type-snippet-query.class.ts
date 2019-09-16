import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { ContentTypeSnippetResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ViewContentTypeSnippetQuery extends BaseQuery<ContentTypeSnippetResponses.ViewContentTypeSnippetResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public identifier: Identifiers.ContentTypeIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<ContentTypeSnippetResponses.ViewContentTypeSnippetResponse> {
    return this.queryService.viewContentTypeSnippet(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.viewContentTypeSnippet(this.identifier);
  }
}

