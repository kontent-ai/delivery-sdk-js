import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { Identifiers, LanguageVariantModels } from '../../models';
import { LanguageVariantResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class UpsertLanguageVariantQuery extends BaseQuery<LanguageVariantResponses.UpsertLanguageVariantResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected contentItemIdentifier: Identifiers.ContentItemIdentifier,
    protected languageIdentifier: Identifiers.LanguageIdentifier,
    public elements: LanguageVariantModels.ILanguageVariantElement[]
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<LanguageVariantResponses.UpsertLanguageVariantResponse> {
    return this.queryService.upsertLanguageVariant(this.getUrl(), this.elements, this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.viewOrUpsertLanguageVariant(this.contentItemIdentifier, this.languageIdentifier);
  }
}


