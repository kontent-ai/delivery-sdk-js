import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { ContentItemIdentifier } from '../../models';
import { LanguageVariantResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ListLanguageVariantsQuery extends BaseQuery<LanguageVariantResponses.ListLanguageVariantsResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected identifier: ContentItemIdentifier,
    protected identifierValue: string
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<LanguageVariantResponses.ListLanguageVariantsResponse> {
    return this.queryService.listLanguageVariants(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    if (this.identifier === ContentItemIdentifier.InternalId) {
      return this.actions.contentItemActions.listLanguageVariantsByInternalId(this.identifierValue);
    }
    if (this.identifier === ContentItemIdentifier.Codename) {
      return this.actions.contentItemActions.listLanguageVariantsByCodename(this.identifierValue);
    }
    if (this.identifier === ContentItemIdentifier.ExternalId) {
      return this.actions.contentItemActions.listLanguageVariantsByExternalId(this.identifierValue);
    }
    throw Error(`Item identifier type '${this.identifier}' is not supported`);
  }
}


