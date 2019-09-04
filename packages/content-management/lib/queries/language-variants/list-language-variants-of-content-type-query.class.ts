import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { LanguageVariantResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ListLanguageVariantsOfContentTypeQuery extends BaseQuery<LanguageVariantResponses.ListLanguageVariantsOfContentTypeResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected identifier: Identifiers.ContentTypeIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<LanguageVariantResponses.ListLanguageVariantsOfContentTypeResponse> {
    return this.queryService.listLanguageVariantsOfContentType(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.listLanguageVariantsOfContentType(this.identifier);
  }
}


