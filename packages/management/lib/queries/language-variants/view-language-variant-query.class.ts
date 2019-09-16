import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { LanguageVariantResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ViewLanguageVariantQuery extends BaseQuery<LanguageVariantResponses.ViewLanguageVariantResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public contentItemIdentifier: Identifiers.ContentItemIdentifier,
    public languageIdentifier: Identifiers.LanguageIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<LanguageVariantResponses.ViewLanguageVariantResponse> {
    return this.queryService.viewLanguageVariant(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.viewOrUpsertLanguageVariant(this.contentItemIdentifier, this.languageIdentifier);
  }
}


