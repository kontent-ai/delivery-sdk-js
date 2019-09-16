import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { LanguageModels } from '../../models';
import { LanguageResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class AddLanguageQuery extends BaseQuery<LanguageResponses.AddLanguageResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public data: LanguageModels.IAddLanguageData
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<LanguageResponses.AddLanguageResponse> {
    return this.queryService.addLanguage(this.getUrl(), this.queryConfig, this.data);
  }

  protected getAction(): string {
    return this.apiEndpoints.addLanguage();
  }
}
