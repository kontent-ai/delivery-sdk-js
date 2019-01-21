import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { ContentItemIdentifier, LanguageIdentifier } from '../../models';
import { LanguageVariantResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ViewLanguageVariantQuery extends BaseQuery<LanguageVariantResponses.ViewLanguageVariantResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected contentItemIdentifier: ContentItemIdentifier,
    protected contentIdentifierValue: string,
    protected languageIdentifier: LanguageIdentifier,
    protected languageIdentifierValue: string,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<LanguageVariantResponses.ViewLanguageVariantResponse> {
    return this.queryService.viewLanguageVariant(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.actions.contentItemActions.viewOrUpsertLanguageVariant(this.contentItemIdentifier, this.contentIdentifierValue, this.languageIdentifier, this.languageIdentifierValue);
  }
}


