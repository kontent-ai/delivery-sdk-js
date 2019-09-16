import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { LanguageVariantResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ListLanguageVariantsOfItemQuery extends BaseQuery<LanguageVariantResponses.ListLanguageVariantsOfItemResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected identifier: Identifiers.ContentItemIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<LanguageVariantResponses.ListLanguageVariantsOfItemResponse> {
    return this.queryService.listLanguageVariantsOfItem(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.listLanguageVariantsOfItem(this.identifier);
  }
}


