import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { TaxonomyModels } from '../../models';
import { TaxonomyResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class AddTaxonomyQuery extends BaseQuery<TaxonomyResponses.AddTaxonomyResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public data: TaxonomyModels.IAddTaxonomyRequestModel
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<TaxonomyResponses.AddTaxonomyResponse> {
    return this.queryService.addTaxonomy(this.getUrl(), this.data, this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.listTaxonomies();
  }
}
