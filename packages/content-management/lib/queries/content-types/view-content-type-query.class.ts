import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { ContentTypeResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ViewContentTypeQuery extends BaseQuery<ContentTypeResponses.ViewContentTypeResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected identifier: Identifiers.ContentItemIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<ContentTypeResponses.ViewContentTypeResponse> {
    return this.queryService.viewContentType(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.actions.contentItemActions.viewContentType(this.identifier);
  }
}
