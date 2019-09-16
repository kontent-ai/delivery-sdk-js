import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { TaxonomyResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ListTaxonomiesQuery extends BaseQuery<TaxonomyResponses.TaxonomyListResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<TaxonomyResponses.TaxonomyListResponse> {
    return this.queryService.listTaxonomies(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.listTaxonomies();
  }
}
