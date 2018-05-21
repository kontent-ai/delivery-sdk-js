import { Observable } from 'rxjs';

import { ITrackingClientConfig } from '../../config';
import { TrackingEmptySuccessResponse, IContactProfileData } from '../../models';
import { TrackingQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class CreateContactProfile extends BaseQuery<TrackingEmptySuccessResponse> {

  private readonly action: string = '/contact';

  constructor(
    protected config: ITrackingClientConfig,
    protected queryService: TrackingQueryService,
    protected profileData: IContactProfileData
  ) {
    super(config, queryService);
  }

  getUrl(): string {
    return this.queryService.getUrl(this.action, this.getParameters());
  }

  getObservable(): Observable<TrackingEmptySuccessResponse> {
    return this.queryService.recordNewSession(this.getUrl(), this.profileData);
  }
}
