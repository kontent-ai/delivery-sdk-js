import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { ContentItemIdentifier, LanguageIdentifier, LanguageVariantModels } from '../../models';
import { LanguageVariantResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class UpsertLanguageVariantQuery extends BaseQuery<LanguageVariantResponses.UpsertLanguageVariantResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected contentItemIdentifier: ContentItemIdentifier,
    protected contentIdentifierValue: string,
    protected languageIdentifier: LanguageIdentifier,
    protected languageIdentifierValue: string,
    protected elements: LanguageVariantModels.ILanguageVariantElement[]
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<LanguageVariantResponses.UpsertLanguageVariantResponse> {
    return this.queryService.upsertLanguageVariant(this.getUrl(), this.elements, this.queryConfig);
  }

  protected getAction(): string {
    return this.actions.contentItemActions.upsertLanguageVariant(this.contentItemIdentifier, this.contentIdentifierValue, this.languageIdentifier, this.languageIdentifierValue);
  }
}


