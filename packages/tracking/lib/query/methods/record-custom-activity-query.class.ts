import { Observable } from 'rxjs';

import { ITrackingClientConfig } from '../../config';
import { TrackingEmptySuccessResponse, IContactRequiredData } from '../../models';
import { TrackingQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class RecordCustomActivityQuery extends BaseQuery<TrackingEmptySuccessResponse> {

  private readonly action: string = '/activity';

  constructor(
    protected config: ITrackingClientConfig,
    protected queryService: TrackingQueryService,
    protected contactData: IContactRequiredData,
    protected activityCodename: string
  ) {
    super(config, queryService);
  }

  getUrl(): string {
    return this.queryService.getUrl(this.action, this.getParameters());
  }

  getObservable(): Observable<TrackingEmptySuccessResponse> {
    return this.queryService.recordCustomActivity(this.getUrl(), this.contactData, this.activityCodename);
  }
}
