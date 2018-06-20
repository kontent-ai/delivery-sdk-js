import { Observable } from 'rxjs';

import { ITrackingClientConfig } from '../../config';
import { TrackingEmptySuccessResponse, IContactRequiredData } from '../../models';
import { TrackingQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class RecordNewSessionQuery extends BaseQuery<TrackingEmptySuccessResponse> {

  private readonly action: string = '/session';

  constructor(
    protected config: ITrackingClientConfig,
    protected queryService: TrackingQueryService,
    protected contactData: IContactRequiredData
  ) {
    super(config, queryService);
  }

  getUrl(): string {
    return this.queryService.getUrl(this.action, this.getParameters());
  }

  getObservable(): Observable<TrackingEmptySuccessResponse> {
    return this.queryService.recordNewSession(this.getUrl(),  this.contactData, this._queryConfig);
  }
}
