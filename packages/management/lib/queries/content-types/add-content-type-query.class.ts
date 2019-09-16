import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { ContentTypeModels } from '../../models';
import { ContentTypeResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class AddContentTypeQuery extends BaseQuery<ContentTypeResponses.AddContentTypeResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public data: ContentTypeModels.IAddContentTypeData,
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<ContentTypeResponses.AddContentTypeResponse> {
    return this.queryService.addContentType(this.getUrl(), this.data, this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.addContentType();
  }
}

