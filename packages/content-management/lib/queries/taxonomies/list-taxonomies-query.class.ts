import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { TaxonomyResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ListTaxonomiesQuery extends BaseQuery<TaxonomyResponses.TaxonomyListResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<TaxonomyResponses.TaxonomyListResponse> {
    return this.queryService.listTaxonomies(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.actions.contentItemActions.listTaxonomies();
  }
}
