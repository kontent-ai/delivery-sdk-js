import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { TaxonomyResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class DeleteTaxonomyQuery extends BaseQuery<TaxonomyResponses.DeleteTaxonomyResponse> {

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected identifier: Identifiers.TaxonomyIdentifier,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<TaxonomyResponses.DeleteTaxonomyResponse> {
    return this.queryService.deleteTaxonomy(this.getUrl(), this.queryConfig);
  }

  protected getAction(): string {
    return this.actions.contentItemActions.deleteTaxonomy(this.identifier);
  }
}
