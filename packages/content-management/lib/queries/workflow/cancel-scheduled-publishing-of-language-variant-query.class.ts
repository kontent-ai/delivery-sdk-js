import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { BaseResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class CancelScheduledPublishingOfLanguageVariantQuery extends BaseQuery<BaseResponses.EmptyContentManagementResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected contentItemIdentifier: Identifiers.ContentItemIdentifier,
    protected languageIdentifier: Identifiers.LanguageIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<BaseResponses.EmptyContentManagementResponse> {
    return this.queryService.cancelScheduledPublishingOfLanguageVariant(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.actions.contentItemActions.cancelScheduledPublishingOfLanguageVariant(this.contentItemIdentifier, this.languageIdentifier);
  }
}
