import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { Identifiers, WorkflowModels } from '../../models';
import { BaseResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class PublishOrScheduleLanguageVariantQuery extends BaseQuery<BaseResponses.EmptyContentManagementResponse> {

  constructor(
    protected config: IManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    public contentItemIdentifier: Identifiers.ContentItemIdentifier,
    public languageIdentifier: Identifiers.LanguageIdentifier,
    public data: WorkflowModels.IPublishOrSchedulePublishData
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<BaseResponses.EmptyContentManagementResponse> {
    return this.queryService.publishOrScheduleLanguageVariant(this.getUrl(), this.data, this.queryConfig);
  }

  protected getAction(): string {
    return this.apiEndpoints.publishOrScheduleLaguageVariant(this.contentItemIdentifier, this.languageIdentifier);
  }
}
