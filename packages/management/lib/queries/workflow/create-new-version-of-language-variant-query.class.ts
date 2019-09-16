import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { BaseResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class CreateNewVersionOfLanguageVariantQuery extends BaseQuery<BaseResponses.EmptyContentManagementResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public contentItemIdentifier: Identifiers.ContentItemIdentifier,
    public languageIdentifier: Identifiers.LanguageIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<BaseResponses.EmptyContentManagementResponse> {
    return this.queryService.createNewVersionOfLanguageVariant(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.createNewVersionOfALanguageVariant(this.contentItemIdentifier, this.languageIdentifier);
  }
}
