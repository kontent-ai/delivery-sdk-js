import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { Identifiers, LanguageModels } from '../../models';
import { LanguageResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ModifyLanguageQuery extends BaseQuery<LanguageResponses.ModifyLanguageResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public identifier: Identifiers.LanguageIdentifier,
    public data: LanguageModels.IModifyLanguageData[]
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<LanguageResponses.ModifyLanguageResponse> {
    return this.queryService.modifyLanguage(this.getUrl(), this.queryConfig, this.data);
  }

  protected getAction(): string {
    return this.apiEndpoints.modifyLanguage(this.identifier);
  }
}
