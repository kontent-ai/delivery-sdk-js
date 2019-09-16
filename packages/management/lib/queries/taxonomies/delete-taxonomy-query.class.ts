import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { TaxonomyResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class DeleteTaxonomyQuery extends BaseQuery<TaxonomyResponses.DeleteTaxonomyResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public identifier: Identifiers.TaxonomyIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<TaxonomyResponses.DeleteTaxonomyResponse> {
    return this.queryService.deleteTaxonomy(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.deleteTaxonomy(this.identifier);
  }
}
